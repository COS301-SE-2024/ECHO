import os

import azure.functions as func

import os
import json

import classification
import utils

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="get_sentiments")
def get_songs(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    access_key = os.environ.get('ACCESS_KEY')
    provided_key = req_body.get('access_key')

    if access_key != provided_key:
        return func.HttpResponse(
            json.dumps({"error": "Unauthorized access. Invalid access key."}),
            mimetype="application/json",
            status_code=401
        )

    try:
        song_name = req_body.get('song_name')
        artist = req_body.get('artist')

        recommended_tracks = req_body.get('recommended_tracks', [])
        
        given_emotion = classification.run_lyric_analysis(song_name, artist)

        for track in recommended_tracks:
            track_name = track.get('track_name')
            artist_name = track.get('artist_name')

            if not track_name or not artist_name:
                return func.HttpResponse(
                    json.dumps({"error": "Please provide both song_name and artist."}),
                    mimetype="application/json",
                    status_code=400
                )
        
            similar_songs = []

            for track in recommended_tracks:
                similar_emotion = False
                emotion = classification.run_lyric_analysis(track_name, artist_name)

                if emotion and given_emotion:
                    distance = utils.emotional_similarity[emotion][given_emotion]
                    if distance >= 7:
                        similar_emotion = True

                    if similar_emotion:
                        similar_songs.append({
                        "track": track,
                        "emotion": emotion
                    })

    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
    
    return func.HttpResponse(
        json.dumps({"recommended_tracks": similar_songs}),
        mimetype="application/json",
        status_code=200
    )


@app.route('/')
def index():
   print('Request for index page received')
   return func.HttpResponse(
        json.dumps({"success": "page loaded, go to /get_sentiments to see recommendations"}),
        mimetype="application/json",
        status_code=200
    )


if __name__ == '__main__':
   app.run()
