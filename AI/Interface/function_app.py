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
    
    song_name = req_body.get('song_name')
    artist = req_body.get('artist')

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
            unprocessed_songs.append(original_song)
        else:
            original_emotion = original_song.get('Emotion', "")
            original_genre = original_song.get('Album Genre', "")
        
        for song in cluster_songs:
            song_uri = song.get('track_uri')
            db_song = db.in_database(song_uri)

            similar_emotion = False
            similar_genre = False

            if db_song is None:
                unprocessed_songs.append(song)
            else:
                emotion = song.get('Emotion', "")
                genre = song.get('Album Genre', "")

                if emotion is not "" and original_emotion is not "":
                    distance = utils.emotional_similarity[original_emotion.lower()][emotion.lower]
                    if distance >= 7:
                        similar_emotion = True

                if genre is not "" and original_genre is not "":
                    distance = utils.genre_similarity[original_genre][genre]
                    if distance >= 7:
                        similar_genre = True

                if similar_emotion and similar_genre:
                    similar_songs.append({"track": song, "emotion": emotion})
            

        
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
    