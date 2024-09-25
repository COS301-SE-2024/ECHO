import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

import cluster

client_id = os.environ.get("CLIENT_ID")
client_secret = os.environ.get("CLIENT_SECRET")

credentials = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=credentials)


def get_song_features(track_id):
    try:
        features = sp.audio_features(track_id)
    except Exception as e:
        print("Error fetching song features")
        return None

    if features:
        return features[0]
    else:
        return None


def get_track_id(track_name, artist_name):
    results = sp.search(q=f'track:{track_name} artist:{artist_name}', type='track')
    items = results['tracks']['items']

    if items:
        return items[0]['id']
    else:
        return None


def get_track_details(uri):
    track_id = uri.split(':')[-1]
    track_info = sp.track(track_id)
    track_name = track_info['name']
    artist_name = track_info['album']['artists'][0]['name'] if track_info['album']['artists'] else 'Unknown Artist'
    return track_name, artist_name


def get_cluster_songs(song_name, artist, n_recommendations):
    track_name = song_name
    artist_name = artist

    track_id = get_track_id(track_name, artist_name)
    song_features = get_song_features(track_id)

    recommended_songs = cluster.recommend_songs(song_features, n_recommendations)
    if recommended_songs is None:
        return None

    recommended_tracks = []

    for uri in recommended_songs:
        recommended_tracks.append({"track_uri": uri})

    return track_id, recommended_tracks


def get_cluster(song_name, artist):
    track_name = song_name
    artist_name = artist

    track_id = get_track_id(track_name, artist_name)
    song_features = get_song_features(track_id)

    cluster_number = cluster.get_cluster_number(song_features)

    return cluster_number
