import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import cluster

client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')

credentials = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=credentials)


def get_song_features(track_id):
    features = sp.audio_features(track_id)

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


def get_spotify_features(track_name, artist_name):
    track_id = get_track_id(track_name, artist_name, sp)
    if track_id:
        features = get_song_features(track_id, sp)
        return features
    else:
        print(f"Track '{track_name}' by {artist_name} not found.")
        return None


def get_track_name(uri):
    track_id = uri.split(':')[-1]
    track_info = sp.track(track_id)
    track_name = track_info['name']
    return track_name


def get_similar_songs(song_name, artist):
    track_name = song_name
    artist_name = artist

    track_id = get_track_id(track_name, artist_name)

    song_features = get_song_features(track_id)

    recommended_songs = cluster.recommend_songs(song_features)

    recommended_track_names = []
    for uri in recommended_songs:
        track_name = get_track_name(uri)
        recommended_track_names.append(track_name)

    # print("Recommended Track Names:")
    # for track_name in recommended_track_names:
    #     print(track_name)

    return recommended_songs
