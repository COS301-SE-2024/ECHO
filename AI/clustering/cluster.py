import csv
import json
import os

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt


file_path = 'music_data.csv'
data = pd.read_csv(file_path, delimiter=',')

features = ['duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']

X = data[features]
X = X.dropna()
scalar = StandardScaler()
X_scaled = scalar.fit_transform(X)
sse = []


def visualise_clusters(clustered_data, centroids, X_scaled):
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    plt.figure(figsize=(10, 6))
    plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clustered_data['Cluster'], cmap='viridis', alpha=0.5, label='Data Points')

    centroids_pca = pca.transform(centroids)
    plt.scatter(centroids_pca[:, 0], centroids_pca[:, 1], c='red', marker='X', s=100, label='Cluster Centroids')

    plt.title('Cluster Visualisation (PCA)')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.legend()
    plt.colorbar()
    plt.grid(True)
    plt.show()


def determine_clusters():
    for k in range(1, 21):
        kmeans = KMeans(n_clusters=k, random_state=42)
        kmeans.fit(X_scaled)
        sse.append(kmeans.inertia_)

    optimal_clusters = 15
    return optimal_clusters


def cluster(optimal_clusters):
    kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
    kmeans.fit(X_scaled)

    data['Cluster'] = kmeans.labels_

    data.to_csv('clustered_music_data.csv', index=False)

    centroids = kmeans.cluster_centers_
    with open('cluster_centroids.json', 'w') as f:
        json.dump(centroids.tolist(), f)

    return kmeans


def load_cluster_data():
    if os.path.exists('clustered_music_data.csv') and os.path.exists('cluster_centroids.json'):
        clustered_data = pd.read_csv('clustered_music_data.csv')
        with open('cluster_centroids.json', 'r') as f:
            centroids = np.array(json.load(f))
        return clustered_data, centroids
    else:
        return None, None


def append_uri(uri):
    with open(file_path, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([uri])


def recommend_songs(music_features, n_recommendations=5):
    clustered_data, centroids = load_cluster_data()

    if clustered_data is None or centroids is None:
        optimal_clusters = determine_clusters()
        cluster(optimal_clusters)
        clustered_data, centroids = load_cluster_data()

    if music_features:

        uri = music_features['uri']
        music_features = {key: music_features[key] for key in features if key in music_features}
        new_song = pd.DataFrame([music_features])

        is_existing_song = (
            (clustered_data[features] == new_song[features].iloc[0]).all(axis=1)
        ).any()

        if not is_existing_song:
            new_row = [music_features[key] for key in features]
            new_row.append(uri)
            data.loc[len(data)] = new_row
            data.to_csv(file_path, index=False)

        new_song_scaled = scalar.transform(new_song[features])
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


# clustered_data, centroids = load_cluster_data()
#
# if clustered_data is not None and centroids is not None:
#     visualise_clusters(clustered_data, centroids, X_scaled)