import json
import os

import numpy as np
import pandas as pd
import pickle

import db

features = ['duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']

from azure.storage.blob import BlobServiceClient

CONNECTION_STRING = os.environ.get("BLOB_STORAGE_CONNECTION_STRING")
BLOB_SERVICE_CLIENT = BlobServiceClient.from_connection_string(CONNECTION_STRING)
CONTAINER_NAME = "inputdata"


def get_scaler():
    FILE_NAME = "scaler.pkl"
    BLOB_CLIENT = BLOB_SERVICE_CLIENT.get_blob_client(container=CONTAINER_NAME, blob=FILE_NAME)

    data = BLOB_CLIENT.download_blob().readall()
    scaler = pickle.loads(data)
    return scaler


def get_X_Scaled():
    FILE_NAME = "X_scaled.pkl"
    BLOB_CLIENT = BLOB_SERVICE_CLIENT.get_blob_client(container=CONTAINER_NAME, blob=FILE_NAME)

    data = BLOB_CLIENT.download_blob().readall()
    X_scaled = pickle.loads(data)
    return X_scaled


def get_centroids():
    FILE_NAME = "cluster_centroids.json"
    BLOB_CLIENT = BLOB_SERVICE_CLIENT.get_blob_client(container=CONTAINER_NAME, blob=FILE_NAME)

    data = BLOB_CLIENT.download_blob().readall().decode('utf-8')
    centroids = json.loads(data)
    return centroids


def recommend_songs(music_features, n_recommendations=50):
    centroids = get_centroids()
    scaler = get_scaler()

    if music_features:
        uri = music_features['uri']

        existing_song = db.check_id(uri)

        music_features = {key: music_features[key] for key in features if key in music_features}
        new_song = pd.DataFrame([music_features])
        new_song = new_song.astype(float)

        new_song_scaled = scaler.transform(new_song[features])
        distances_to_centroids = np.linalg.norm(centroids - new_song_scaled, axis=1)
        closest_centroid_index = np.argmin(distances_to_centroids)

        if existing_song is None:
            song = {
                "duration_ms": str(music_features['duration_ms']), 
                "energy": str(music_features['energy']),
                "loudness": str(music_features['loudness']),
                "speechiness": str(music_features['speechiness']),
                "acousticness": str(music_features['acousticness']),
                "instrumentalness": str(music_features['instrumentalness']),
                "liveness": str(music_features['liveness']),
                "valence": str(music_features['valence']),
                "tempo": str(music_features['tempo']),
                "uri": str(uri), 
                "Cluster": str(closest_centroid_index),
                "id": str(uri)
            }

            db.store_song(song)

        cluster_data = db.read_from_cluster(closest_centroid_index)

        if cluster_data is None or cluster_data == []:
            return None
        
        cluster_df = pd.DataFrame(cluster_data)

        cluster_features = cluster_df[features].astype(float).values
        distances = np.linalg.norm(cluster_features - new_song_scaled, axis=1)

        closest_indices = np.argsort(distances)[:n_recommendations]
        closest_songs = cluster_df.iloc[closest_indices]

        recommended_uris = closest_songs['uri'].tolist()
        if uri in recommended_uris:
            recommended_uris.remove(uri)

        return recommended_uris
    
    else:
        return None
    

def get_cluster_number(music_features):
    centroids = get_centroids()

    if music_features:
        music_features = {key: music_features[key] for key in features if key in music_features}
        new_song = pd.DataFrame([music_features])

        scaler = get_scaler()

        new_song_scaled = scaler.transform(new_song[features])
        distances_to_centroids = np.linalg.norm(centroids - new_song_scaled, axis=1)
        closest_centroid_index = np.argmin(distances_to_centroids)

        return closest_centroid_index
    else:
        return None
