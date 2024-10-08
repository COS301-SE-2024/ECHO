import concurrent.futures
import azure.functions as func
import json
import os

import db
import utils

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

NUM_SONGS = 100  # Number of songs to request
REQUIRED_RECOMMENDATIONS = 10  # Minimum required recommendations

@app.route(route="get_recommendations")
def get_recommendations(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()

        ACCESS_KEY = os.environ.get("ACCESS_KEY")
        provided_key = req_body.get('access_key')

        if ACCESS_KEY != provided_key:
            print("Unauthorized access. Invalid access key.")
            return func.HttpResponse(
                json.dumps({"error": "Unauthorized access. Invalid access key."}),
                mimetype="application/json",
                status_code=401
            )

        song_name = req_body.get("song_name")
        artist = req_body.get("artist")

        if not song_name or not artist:
            print("Error: song_name or artist is missing.")
            return func.HttpResponse(
                json.dumps({"error": "Please provide both song_name and artist."}),
                mimetype="application/json",
                status_code=400
            )

        print(f"Processing song: {song_name} by {artist}")

        # Check if the song is already in the database
        original_uri = utils.get_track_id(song_name, artist)
        recommendations_stored = db.check_recommendations(original_uri)

        if recommendations_stored is not None:
            print(f"Recommendations already stored for {original_uri}")
            return func.HttpResponse(
                json.dumps({"recommended_songs": recommendations_stored.get('recommended_tracks')}),
                mimetype="application/json",
                status_code=200
            )

        # Get original song details (only if not already stored)
        original_song = db.check_id(original_uri)
        cluster_songs = None  # Ensure cluster_songs is initialized
        processed_song_uris = set()  # Keep track of processed song URIs

        if original_song is None:
            print(f"Original song not found in the database. Fetching cluster songs.")
            original_uri, cluster_number, cluster_songs = utils.get_cluster_songs(song_name, artist, NUM_SONGS)
            print(f"Cluster songs fetched: {len(cluster_songs)} songs")
            if cluster_songs is None:
                return func.HttpResponse(
                json.dumps({"error": "Error fetching cluster songs."}),
                mimetype="application/json",
                status_code=400
            )

            original_genre = utils.get_genre(song_name, artist)
            original_emotion = utils.get_sentiment(song_name, artist)

            original_json = {
                "id": original_uri,
                "SongName": song_name,
                "Artist": artist,
                "URI": original_uri,
                "ClusterNumber": str(cluster_number),
                "Emotion": original_emotion,
                "AlbumGenre": original_genre
            }
            print("Saving song to database:", original_json)

            db.store_song(original_json)
            print(f"Original song stored in the database: {original_json}")
        else:
            print(f"Original song found in the database.")
            cluster_number = original_song.get('ClusterNumber')
            original_emotion = original_song.get('Emotion', "")
            original_genre = original_song.get('AlbumGenre', "")

        similar_songs = []

        # Fetch 10 songs and process them
        if cluster_songs is None:
            _, _, cluster_songs = utils.get_cluster_songs(song_name, artist, NUM_SONGS)

        if cluster_songs is None or len(cluster_songs) == 0:
            print(f"No cluster songs found.")
            return func.HttpResponse(
                json.dumps({"error": "No cluster songs found."}),
                mimetype="application/json",
                status_code=400
            )

        print(f"Processing {len(cluster_songs)} cluster songs.")

        unprocessed_songs = []
        for song in cluster_songs:
            song_uri = song.get('track_uri')

            # Skip songs that have already been processed
            if song_uri in processed_song_uris:
                continue
            
            track_name, artist_name = utils.get_track_details(song.get('track_uri'))
            print("Track Details: " + str(track_name) + ", " + str(artist_name))

            # Immediately add songs by the same artist to recommendations
            if artist_name.lower() == artist.lower():
                print(f"Adding song by the same artist: {track_name} by {artist_name}")
                similar_songs.append({
                    "track": song_uri,
                    "artist": artist_name,
                    "track_name": track_name,
                    "emotion": "",  # Will update after processing
                    "genre": ""     # Will update after processing
                })
                processed_song_uris.add(song_uri)
                continue  # Skip further processing for this song

            db_song = db.check_id(song_uri)

            if db_song is None:
                print("Song not in database")
                unprocessed_songs.append({"track_name": track_name, "artist_name": artist_name, "track_uri": song_uri})
            else:
                print("Song found in database")
                similar_songs.extend(process_existing_song(db_song, original_emotion, original_genre))
                processed_song_uris.add(song_uri)

        if unprocessed_songs:
            print(f"Processing {len(unprocessed_songs)} unprocessed songs.")

            # Execute get_all_sentiments and get_all_genres simultaneously
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future_sentiments = executor.submit(utils.get_all_sentiments, unprocessed_songs)
                future_genres = executor.submit(utils.get_all_genres, unprocessed_songs)

                # Wait for both results
                emotions = future_sentiments.result()
                genres = future_genres.result()

            for i, song in enumerate(unprocessed_songs):
                track_uri = song.get('track_uri')
                emotion = emotions["recommended_tracks"][i].get("emotion", "")
                genre = genres["recommended_tracks"][i].get("genre", "")

                song_json = {
                    "id": track_uri,
                    "SongName": song.get('track_name'),
                    "Artist": song.get('artist_name'),
                    "URI": track_uri,
                    "ClusterNumber": str(cluster_number),
                    "Emotion": emotion,
                    "AlbumGenre": genre
                }
                print(f"Storing unprocessed song: {song_json}")
                db.store_song(song_json)
                similar_songs.extend(process_existing_song(song_json, original_emotion, original_genre))
                processed_song_uris.add(track_uri)

        print(f"Current recommendations: {len(similar_songs)}")

        # Only store recommendations if they meet the required number
        if len(similar_songs) >= 4:
            store_recommendations = {
                "id": original_uri,
                "URI": original_uri,
                "recommended_tracks": similar_songs[:REQUIRED_RECOMMENDATIONS]  # Return only up to the required number
            }
            print(f"Storing recommendations: {store_recommendations}")
            db.store_recommendations(store_recommendations)
            print(f"Stored recommendations for {original_uri}")

            return func.HttpResponse(
                json.dumps({"recommended_songs": similar_songs[:REQUIRED_RECOMMENDATIONS]}),
                mimetype="application/json",
                status_code=200
            )
        else:
            print("Not enough recommendations found. No data stored.")
            return func.HttpResponse(
                json.dumps({"recommended_songs": similar_songs}),
                mimetype="application/json",
                status_code=200
            )

    except json.JSONDecodeError as json_error:
        # Debug JSON parsing error
        print(f"JSON decode error: {json_error}")
        return func.HttpResponse(
            json.dumps({"error": f"JSON decode error: {json_error}"}),
            mimetype="application/json",
            status_code=400
        )

    except Exception as e:
        print(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )

def process_existing_song(db_song, original_emotion, original_genre):
    similar_songs = []
    similar_emotion = False
    similar_genre = False

    emotion = db_song.get('Emotion', "")
    genre = db_song.get('AlbumGenre', "")

    if emotion and original_emotion:
        if emotion.lower() == original_emotion.lower():
            similar_emotion = True

    if genre and original_genre:
        if genre in utils.genre_similarity and original_genre in utils.genre_similarity:
            distance = utils.genre_similarity[original_genre][genre]
            if distance >= 8:
                similar_genre = True

    print("Genre: ", genre, " Emotion: ", emotion)

    if similar_emotion and similar_genre:
        similar_songs.append({"track": db_song.get('URI'), "emotion": emotion.title()})
        print(f"Added similar song: {db_song.get('URI')} with emotion {emotion.title()}")

    return similar_songs
