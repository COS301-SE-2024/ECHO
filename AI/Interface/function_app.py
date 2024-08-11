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
        return func.HttpResponse(
            json.dumps({"error": "Unauthorized access. Invalid access key."}),
            mimetype="application/json",
            status_code=401
        )

    try:
        song_name = req_body.get("song_name")
        artist = req_body.get("artist")

        if not song_name or not artist:
            return func.HttpResponse(
                json.dumps({"error": "Please provide both song_name and artist."}),
                mimetype="application/json",
                status_code=400
            )
        
        similar_songs = []
        
        original_song_id, cluster_number, cluster_songs = utils.get_cluster_songs(song_name, artist)
        original_song = db.check_id(original_song_id)

        original_emotion = ""
        original_genre = ""

        unprocessed_songs = []

        if original_song is None:
            original_uri = utils.get_track_id(song_name, artist)
            original_genre = utils.get_genre(song_name, artist)
            original_emotion = utils.get_sentiment(song_name, artist)

            original_json = {
                "id": original_uri, 
                "SongName": song_name,
                "Artist": artist,
                "URI": original_uri,
                "ClusterNumber": cluster_number,
                "Emotion": original_emotion,
                "AlbumGenre": original_genre
            }
            db.store_song(original_json)
            # print(original_json)
            # print()

        else:
            original_uri = original_song.get('URI')
            original_emotion = original_song.get('Emotion', "")
            original_genre = original_song.get('AlbumGenre', "")
            # print(original_song)
            # print()
        
        for song in cluster_songs:
            song_uri = song.get('track_uri')
            db_song = db.check_id(song_uri)

            similar_emotion = False
            similar_genre = False

            if db_song is None:
                track_name, artist_name = utils.get_track_details(song.get('track_uri'))
                unprocessed_songs.append({"track_name": track_name, "artist_name": artist_name, "track_uri": song_uri})
            else:
                # print(db_song)
                # print()
                # print(db_song)
                emotion = db_song.get('Emotion', "")
                genre = db_song.get('AlbumGenre', "")
                # print(genre)

                if emotion is not "" and original_emotion is not "":
                    distance = utils.emotional_similarity[original_emotion.lower()][emotion.lower()]
                    print("Emotion distance: " + str(distance))
                    if distance >= 7:
                        similar_emotion = True

                if genre is not "" and original_genre is not "":
                    distance = utils.genre_similarity[original_genre][genre]
                    print("Genre distance: " + str(distance))
                    if distance >= 7:
                        similar_genre = True

                if similar_emotion and similar_genre:
                    similar_songs.append({"track": song, "emotion": emotion.title()})

        if unprocessed_songs:
            emotions = utils.get_all_sentiments(unprocessed_songs)
            genres = utils.get_all_genres(unprocessed_songs)

            for i, song in enumerate(unprocessed_songs):
                song_name = song.get('track_name')
                artist_name = song.get('artist_name')
                track_uri = song.get('track_uri')
                
                emotion = emotions["recommended_tracks"][i].get("emotion", "")
                genre = genres["recommended_tracks"][i].get("genre", "")

                song_json = {
                    "id": track_uri,
                    "SongName": song_name,
                    "Artist": artist_name,
                    "URI": track_uri,
                    "ClusterNumber": str(cluster_number),
                    "Emotion": emotion,
                    "AlbumGenre": genre
                }
                db.store_song(song_json)
                # print(song_json)
                # print()

                similar_emotion = False
                similar_genre = False

                if emotion is not "" and original_emotion is not "":
                    distance = utils.emotional_similarity[original_emotion.lower()][emotion.lower()]
                    if distance >= 7:
                        similar_emotion = True

                if genre is not "" and original_genre is not "":
                    distance = utils.genre_similarity[original_genre][genre]
                    if distance >= 7:
                        similar_genre = True

                if similar_emotion and similar_genre:
                    similar_songs.append({"track": song, "emotion": emotion.title()})

        
        return func.HttpResponse(
            json.dumps({"recommended_songs": similar_songs}),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
    