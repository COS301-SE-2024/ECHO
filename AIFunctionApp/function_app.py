import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import os
import pandas as pd
import json
from io import StringIO

from spotify_utils import get_similar_songs

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="get_songs")
def get_songs(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    ACCESS_KEY = os.environ.get("ACCESS_KEY")
    provided_key = req_body.get("access_key")

    if ACCESS_KEY != provided_key:
        return func.HttpResponse(
            json.dumps({"error": "Unauthorized access. Invalid access key."}),
            mimetype="application/json",
            status_code=401
        )

    try:
        
        song_name = req_body.get('song_name')
        artist = req_body.get('artist')

        if not song_name or not artist:
            return func.HttpResponse(
                json.dumps({"error": "Please provide both song_name and artist."}),
                mimetype="application/json",
                status_code=400
            )

        recommended_tracks = get_similar_songs(song_name, artist)
        print(recommended_tracks)

        return func.HttpResponse(
            json.dumps({"recommended_tracks": recommended_tracks}),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )