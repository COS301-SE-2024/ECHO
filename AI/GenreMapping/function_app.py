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
        similar_songs = []

        song_name = req_body.get('song_name')
        artist = req_body.get('artist')

        recommended_tracks = req_body.get('recommended_tracks', [])

        given_genre = genre.get_album_genre(song_name, artist)

        for track in recommended_tracks:
            track_name = track.get('track_name')
            artist_name = track.get('artist_name')

            if not track_name or not artist_name:
                return func.HttpResponse(
                json.dumps({"error": "Please provide both song_name and artist."}),
                mimetype="application/json",
                status_code=400
            )

            similar_genre = False
            album_genre = genre.get_album_genre(track_name, artist_name)

            if given_genre and album_genre:
                distance = utils.genre_similarity[given_genre][album_genre]
                if distance >= 7:
                    similar_genre = True

                if similar_genre is True:
                    similar_songs.append({
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
        json.dumps({"recommended_tracks": similar_songs}),
        mimetype="application/json",
        status_code=200
    )
