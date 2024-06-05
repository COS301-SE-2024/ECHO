import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import cluster

client_id = '622549f462b245a9ba91a25b36bf4d6a'
client_secret = '1769099357184c52b54ac9ee5c5c611e'

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


def get_track_details(uri):
    track_id = uri.split(':')[-1]
    track_info = sp.track(track_id)
    track_name = track_info['name']
    artist_name = track_info['album']['artists'][0]['name'] if track_info['album']['artists'] else 'Unknown Artist'
    return track_name, artist_name


def get_similar_songs(song_name, artist):
    track_name = song_name
    artist_name = artist

    track_id = get_track_id(track_name, artist_name)

    song_features = get_song_features(track_id)

    recommended_songs = cluster.recommend_songs(song_features)

    recommended_tracks = []

    for uri in recommended_songs:
        track = get_track_details(uri)
        recommended_tracks.append(track)

    print("Recommended Tracks:")
    for track_name, artist_name in recommended_tracks:
        print(f"{track_name} - {artist_name}")

    return recommended_tracks


songs = get_similar_songs("Not Like Us", "Kendrick Lamar")
