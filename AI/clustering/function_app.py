import os
import json

import azure.functions as func

import utils

MIN_RECOMMENDATIONS = 10
INITIAL_SONGS_REQUESTED = 50

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="get_songs")
def get_songs(req: func.HttpRequest) -> func.HttpResponse:
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
        
        track_name = song_name
        artist_name = artist

        cluster_number = utils.get_cluster(track_name, artist_name)
        cluster_number = int(cluster_number)
        cluster_songs = utils.get_cluster_songs(track_name, artist_name, INITIAL_SONGS_REQUESTED)

        if cluster_songs is None:
            return func.HttpResponse(
                json.dumps({"error": "Could not fetch recommendations"}),
                mimetype="application/json",
                status_code=500
            )

        return func.HttpResponse(
            json.dumps({
                "cluster_number": cluster_number,
                "recommended_tracks": cluster_songs
            }),
        mimetype="application/json",
        status_code=200
    )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
