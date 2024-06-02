import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns

file_path = 'music_data.csv'
data = pd.read_csv(file_path, delimiter=';')

features = ['duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
X = data[features]

X = X.dropna()

scalar = StandardScaler()
X_scaled = scalar.fit_transform(X)

sse = []
# for k in range(1, 11):
#     kmeans = KMeans(n_clusters=k, random_state=42)
#     kmeans.fit(X_scaled)
#     sse.append(kmeans.inertia_)
#
# plt.figure(figsize=(10, 6))
# plt.plot(range(1, 11), sse, marker='o')
# plt.title('Elbow Method')
# plt.xlabel('Number of clusters')
# plt.ylabel('SSE')
# plt.show()

optimal_clusters = 10
kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
kmeans.fit(X_scaled)

data['Cluster'] = kmeans.labels_
#
# plt.figure(figsize=(12, 8))
# sns.scatterplot(data=data, x='tempo', y='acousticness', hue='Cluster', palette='viridis')
# plt.title('Clusters based on Tempo and Acousticness')
# plt.show()
#
# plt.figure(figsize=(12, 8))
# sns.scatterplot(data=data, x='loudness', y='valence', hue='Cluster', palette='viridis')
# plt.title('Clusters based on Loudness and Valence')
# plt.show()
#
# data.to_csv('clustered_music_data.csv', index=False)


def recommend_songs(music_features, n_recommendations=5):
    song_features = music_features
    if song_features:
        new_song = pd.DataFrame([song_features])

        new_song_features = new_song[features]

        new_song_scaled = scalar.transform(new_song_features)

        new_song_cluster = kmeans.predict(new_song_scaled)[0]

        cluster_data = data[data['Cluster'] == new_song_cluster]

        cluster_indices = cluster_data.index
        cluster_features = X_scaled[cluster_indices]
        distances = np.linalg.norm(cluster_features - new_song_scaled, axis=1)

        closest_indices = np.argsort(distances)[:n_recommendations]
        closest_songs = data.iloc[cluster_indices[closest_indices]]

        return closest_songs['uri']
    else:
        return None
