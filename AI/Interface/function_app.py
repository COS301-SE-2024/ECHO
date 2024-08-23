import azure.functions as func
import json
import os

import db
import utils

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="get_recommendations")
def get_recommendations(req: func.HttpRequest) -> func.HttpResponse:
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

    try:
        song_name = req_body.get("song_name")
        artist = req_body.get("artist")

        cluster_songs = None

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
        print(f"Original URI: {original_uri}")
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
        if original_song is None:
            print(f"Original song not found in the database. Fetching cluster songs.")
            original_uri, cluster_number, cluster_songs = utils.get_cluster_songs(song_name, artist)
            if cluster_songs is None:
                return func.HttpResponse(
                json.dumps({"error": "Error fetching cluster songs."}),
                mimetype="application/json",
                status_code=400
            )
                
            print("got cluster songs")
            original_genre = utils.get_genre(song_name, artist)
            print("got genre")
            original_emotion = utils.get_sentiment(song_name, artist)
            print("got sentiment")

            original_json = {
                "id": original_uri,
                "SongName": song_name,
                "Artist": artist,
                "URI": original_uri,
                "ClusterNumber": str(cluster_number),
                "Emotion": original_emotion,
                "AlbumGenre": original_genre
            }
            print("saving song to database")

            db.store_song(original_json)
            print(f"Original song stored in the database: {original_json}")
        else:
            print(f"Original song found in the database.")
            cluster_number = original_song.get('ClusterNumber')
            original_emotion = original_song.get('Emotion', "")
            original_genre = original_song.get('AlbumGenre', "")

        # If song was not in the database, get cluster songs now
        if original_song is None:
            print(f"Fetching cluster songs for {song_name} by {artist}")

        similar_songs = []
        if cluster_songs is None:
            original_uri, cluster_number, cluster_songs = utils.get_cluster_songs(song_name, artist)

        print(f"Processing {len(cluster_songs)} cluster songs.")

        # Process cluster songs
        unprocessed_songs = []
        for song in cluster_songs:
            song_uri = song.get('track_uri')
            db_song = db.check_id(song_uri)

            if db_song is None:
                track_name, artist_name = utils.get_track_details(song.get('track_uri'))
                unprocessed_songs.append({"track_name": track_name, "artist_name": artist_name, "track_uri": song_uri})
            else:
                similar_songs.extend(process_existing_song(db_song, original_emotion, original_genre))

        print(f"Unprocessed songs count: {len(unprocessed_songs)}")

        # Step 5: Process unprocessed songs
        if unprocessed_songs:
            emotions = utils.get_all_sentiments(unprocessed_songs)
            genres = utils.get_all_genres(unprocessed_songs)

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
                db.store_song(song_json)
                print(f"Stored unprocessed song: {song_json}")
                similar_songs.extend(process_existing_song(song_json, original_emotion, original_genre))

        # Step 6: Store and return recommendations
        store_recommendations = {
            "id": original_uri,
            "URI": original_uri,
            "recommended_tracks": similar_songs
        }
        db.store_recommendations(store_recommendations)
        print(f"Stored recommendations for {original_uri}: {store_recommendations}")

        return func.HttpResponse(
            json.dumps({"recommended_songs": similar_songs}),
            mimetype="application/json",
            status_code=200
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

    if similar_emotion and similar_genre:
        similar_songs.append({"track": db_song.get('URI'), "emotion": emotion.title()})
        print(f"Added similar song: {db_song.get('URI')} with emotion {emotion.title()}")

    return similar_songs
