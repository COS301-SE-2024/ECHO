import json
import csv
import os

import numpy as np
import pandas as pd
import pickle

from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

CONNECTION_STRING = os.environ.get("BLOB_STORAGE_CONNECTION_STRING")
BLOB_SERVICE_CLIENT = BlobServiceClient.from_connection_string(CONNECTION_STRING)
CONTAINER_NAME = "inputdata"

features = ['duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']


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


def get_cluster_data():
    csv_file_path = "clustered_music_data.csv"

    try:
        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file_path)
        return df
    except Exception as e:
        return None
    # FILE_NAME = "clustered_music_data.csv"
    # BLOB_CLIENT = BLOB_SERVICE_CLIENT.get_blob_client(container=CONTAINER_NAME, blob=FILE_NAME)

    # data = BLOB_CLIENT.download_blob().readall().decode('utf-8')
    # clustered_music_data = pd.read_csv(data)
    # return clustered_music_data


def get_centroids():
    FILE_NAME = "cluster_centroids.json"
    BLOB_CLIENT = BLOB_SERVICE_CLIENT.get_blob_client(container=CONTAINER_NAME, blob=FILE_NAME)

    data = BLOB_CLIENT.download_blob().readall().decode('utf-8')
    centroids = json.loads(data)
    return centroids


def recommend_songs(music_features, n_recommendations=10):
    clustered_data = get_cluster_data()
    print("clusters")
    centroids = get_centroids()
    print("centroids")

    scaler = get_scaler()
    print("scaler")
    X_scaled = get_X_Scaled()

    if music_features:
        uri = music_features['uri']
        music_features = {key: music_features[key] for key in features if key in music_features}
        new_song = pd.DataFrame([music_features])

        is_existing_song = (
            (clustered_data[features] == new_song[features].iloc[0]).all(axis=1)
        ).any()

        new_song_scaled = scaler.transform(new_song[features])
        distances_to_centroids = np.linalg.norm(centroids - new_song_scaled, axis=1)
        closest_centroid_index = np.argmin(distances_to_centroids)

        cluster_data = clustered_data[clustered_data['Cluster'] == closest_centroid_index]

        if is_existing_song:
            existing_song_index = (
                (clustered_data[features] == new_song[features].iloc[0]).all(axis=1)
            ).idxmax()
            cluster_data = cluster_data.drop(index=existing_song_index)

        cluster_indices = cluster_data.index
        cluster_features = X_scaled[cluster_indices]
        distances = np.linalg.norm(cluster_features - new_song_scaled, axis=1)

        closest_indices = np.argsort(distances)[:n_recommendations]
        closest_songs = clustered_data.iloc[cluster_indices[closest_indices]]

        return closest_songs['uri']
    else:
        return None