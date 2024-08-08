import azure.functions as func

import os
import json

import genre
import utils

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="get_genres")
def get_songs(req: func.HttpRequest) -> func.HttpResponse:
    print("received")
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
        song_genres = []
        recommended_tracks = req_body.get('recommended_tracks', [])

        for track in recommended_tracks:
            track_name = track.get('track_name')
            artist_name = track.get('artist_name')

            if not track_name or not artist_name:
                return func.HttpResponse(
                json.dumps({"error": "Please provide both song_name and artist."}),
                mimetype="application/json",
                status_code=400
            )

            album_genre = genre.get_album_genre(track_name, artist_name)

            song_genres.append({
                "track": track, 
                "genre": album_genre
            })

    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
    
    return func.HttpResponse(
        json.dumps({"recommended_tracks": song_genres}),
        mimetype="application/json",
        status_code=200
    )
