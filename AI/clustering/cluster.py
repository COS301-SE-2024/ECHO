import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns

file_path = 'music_data.csv'
data = pd.read_csv(file_path, delimiter=';')

features = ['duration (ms)', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'labels']
X = data[features]

X = X.dropna()

scalar = StandardScaler()
X_scaled = scalar.fit_transform(X)

sse = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    sse.append(kmeans.inertia_)

plt.figure(figsize=(10, 6))
plt.plot(range(1, 11), sse, marker='o')
plt.title('Elbow Method')
plt.xlabel('Number of clusters')
plt.ylabel('SSE')
plt.show()

optimal_clusters = 10
kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
kmeans.fit(X_scaled)

data['Cluster'] = kmeans.labels_

plt.figure(figsize=(12, 8))
sns.scatterplot(data=data, x='tempo', y='acousticness', hue='Cluster', palette='viridis')
plt.title('Clusters based on Tempo and Acousticness')
plt.show()

plt.figure(figsize=(12, 8))
sns.scatterplot(data=data, x='loudness', y='valence', hue='Cluster', palette='viridis')
plt.title('Clusters based on Loudness and Valence')
plt.show()

data.to_csv('clustered_music_data.csv', index=False)


def recommend_songs(data, features, X_scaled, index, n_recommendations=5):
    selected_song = data.iloc[index]
    selected_cluster = selected_song['Cluster']

    cluster_data = data[data['Cluster'] == selected_cluster]

    selected_song_scaled = X_scaled[index].reshape(1, -1)

    cluster_indices = cluster_data.index
    cluster_features = X_scaled[cluster_indices]
    distances = np.linalg.norm(cluster_features - selected_song_scaled, axis=1)

    closest_indices = np.argsort(distances)[1:n_recommendations + 1]  # Skip the first one because it's the song itself
    closest_songs = data.iloc[cluster_indices[closest_indices]]

    return closest_songs


random_index = np.random.randint(0, len(data))
print("Selected song index:", random_index)

recommendations = recommend_songs(data, features, X_scaled, random_index)
print("Recommendations:")
print(recommendations)