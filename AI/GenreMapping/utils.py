import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

credentials = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=credentials)


genre_similarity = {
    "Pop": {"Pop": 10, "Kwaito": 5, "Rap/Hip Hop": 8, "Rock": 7, "Dance": 9, "R&B": 8, "Alternative": 6, "Christian": 4, "Electro": 9, "Folk": 5, "Reggae": 6, "Jazz": 4, "Classical": 2, "Films/Games": 3, "Metal": 4, "Soul & Funk": 7, "African Music": 6, "Asian Music": 5, "Blues": 4, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 8},
    "Kwaito": {"Kwaito": 10, "Pop": 5, "Rap/Hip Hop": 8, "Rock": 5, "Dance": 7, "R&B": 6, "Alternative": 5, "Christian": 4, "Electro": 6, "Folk": 4, "Reggae": 7, "Jazz": 3, "Classical": 2, "Films/Games": 3, "Metal": 4, "Soul & Funk": 6, "African Music": 8, "Asian Music": 5, "Blues": 4, "Brazilian Music": 5, "Indian Music": 3, "Latin Music": 7},
    "Rap/Hip Hop": {"Rap/Hip Hop": 10, "Pop": 8, "Kwaito": 8, "Rock": 6, "Dance": 7, "R&B": 9, "Alternative": 5, "Christian": 4, "Electro": 8, "Folk": 3, "Reggae": 6, "Jazz": 4, "Classical": 2, "Films/Games": 3, "Metal": 4, "Soul & Funk": 8, "African Music": 7, "Asian Music": 5, "Blues": 4, "Brazilian Music": 6, "Indian Music": 4, "Latin Music": 8},
    "Rock": {"Rock": 10, "Pop": 7, "Kwaito": 5, "Rap/Hip Hop": 6, "Dance": 6, "R&B": 6, "Alternative": 8, "Christian": 5, "Electro": 6, "Folk": 7, "Reggae": 5, "Jazz": 4, "Classical": 3, "Films/Games": 4, "Metal": 9, "Soul & Funk": 6, "African Music": 5, "Asian Music": 4, "Blues": 6, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 7},
    "Dance": {"Dance": 10, "Pop": 9, "Kwaito": 7, "Rap/Hip Hop": 7, "Rock": 6, "R&B": 8, "Alternative": 5, "Christian": 4, "Electro": 9, "Folk": 4, "Reggae": 6, "Jazz": 3, "Classical": 2, "Films/Games": 3, "Metal": 5, "Soul & Funk": 7, "African Music": 7, "Asian Music": 6, "Blues": 4, "Brazilian Music": 6, "Indian Music": 4, "Latin Music": 8},
    "R&B": {"R&B": 10, "Pop": 8, "Kwaito": 6, "Rap/Hip Hop": 9, "Rock": 6, "Dance": 8, "Alternative": 5, "Christian": 4, "Electro": 8, "Folk": 4, "Reggae": 7, "Jazz": 5, "Classical": 2, "Films/Games": 3, "Metal": 4, "Soul & Funk": 9, "African Music": 6, "Asian Music": 5, "Blues": 5, "Brazilian Music": 6, "Indian Music": 4, "Latin Music": 8},
    "Alternative": {"Alternative": 10, "Pop": 6, "Kwaito": 5, "Rap/Hip Hop": 5, "Rock": 8, "Dance": 5, "R&B": 5, "Christian": 4, "Electro": 6, "Folk": 6, "Reggae": 5, "Jazz": 4, "Classical": 3, "Films/Games": 4, "Metal": 8, "Soul & Funk": 5, "African Music": 5, "Asian Music": 4, "Blues": 5, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 6},
    "Christian": {"Christian": 10, "Pop": 4, "Kwaito": 4, "Rap/Hip Hop": 4, "Rock": 5, "Dance": 4, "R&B": 4, "Alternative": 4, "Electro": 4, "Folk": 5, "Reggae": 4, "Jazz": 3, "Classical": 4, "Films/Games": 3, "Metal": 4, "Soul & Funk": 4, "African Music": 5, "Asian Music": 4, "Blues": 3, "Brazilian Music": 4, "Indian Music": 4, "Latin Music": 5},
    "Electro": {"Electro": 10, "Pop": 9, "Kwaito": 6, "Rap/Hip Hop": 8, "Rock": 6, "Dance": 9, "R&B": 8, "Alternative": 6, "Christian": 4, "Folk": 4, "Reggae": 5, "Jazz": 3, "Classical": 2, "Films/Games": 3, "Metal": 5, "Soul & Funk": 7, "African Music": 6, "Asian Music": 6, "Blues": 4, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 7},
    "Folk": {"Folk": 10, "Pop": 5, "Kwaito": 4, "Rap/Hip Hop": 3, "Rock": 7, "Dance": 4, "R&B": 4, "Alternative": 6, "Christian": 5, "Electro": 4, "Reggae": 5, "Jazz": 4, "Classical": 5, "Films/Games": 4, "Metal": 5, "Soul & Funk": 4, "African Music": 5, "Asian Music": 5, "Blues": 6, "Brazilian Music": 5, "Indian Music": 5, "Latin Music": 6},
    "Reggae": {"Reggae": 10, "Pop": 6, "Kwaito": 7, "Rap/Hip Hop": 6, "Rock": 5, "Dance": 6, "R&B": 7, "Alternative": 5, "Christian": 4, "Electro": 5, "Folk": 5, "Jazz": 5, "Classical": 3, "Films/Games": 3, "Metal": 4, "Soul & Funk": 6, "African Music": 7, "Asian Music": 5, "Blues": 5, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 7},
    "Jazz": {"Jass": 10, "Pop": 4, "Kwaito": 3, "Rap/Hip Hop": 4, "Rock": 4, "Dance": 3, "R&B": 5, "Alternative": 4, "Christian": 3, "Electro": 3, "Folk": 4, "Reggae": 5, "Classical": 4, "Films/Games": 3, "Metal": 4, "Soul & Funk": 5, "African Music": 4, "Asian Music": 4, "Blues": 6, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 5},
    "Classical": {"Classical": 10, "Pop": 2, "Kwaito": 2, "Rap/Hip Hop": 2, "Rock": 3, "Dance": 2, "R&B": 2, "Alternative": 3, "Christian": 4, "Electro": 2, "Folk": 5, "Reggae": 3, "Jazz": 4, "Films/Games": 4, "Metal": 3, "Soul & Funk": 3, "African Music": 3, "Asian Music": 4, "Blues": 5, "Brazilian Music": 4, "Indian Music": 4, "Latin Music": 3},
    "Films/Games": {"Films/Games": 10, "Pop": 3, "Kwaito": 3, "Rap/Hip Hop": 3, "Rock": 4, "Dance": 3, "R&B": 3, "Alternative": 4, "Christian": 3, "Electro": 3, "Folk": 4, "Reggae": 3, "Jazz": 3, "Classical": 4, "Metal": 4, "Soul & Funk": 3, "African Music": 4, "Asian Music": 3, "Blues": 4, "Brazilian Music": 3, "Indian Music": 3, "Latin Music": 4},
    "Metal": {"Metal": 10, "Pop": 4, "Kwaito": 4, "Rap/Hip Hop": 4, "Rock": 9, "Dance": 5, "R&B": 4, "Alternative": 8, "Christian": 4, "Electro": 5, "Folk": 5, "Reggae": 4, "Jazz": 4, "Classical": 3, "Films/Games": 4, "Soul & Funk": 4, "African Music": 4, "Asian Music": 4, "Blues": 5, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 5},
    "Soul & Funk": {"Soul & Funk": 10, "Pop": 7, "Kwaito": 6, "Rap/Hip Hop": 8, "Rock": 6, "Dance": 7, "R&B": 9, "Alternative": 5, "Christian": 4, "Electro": 7, "Folk": 4, "Reggae": 6, "Jazz": 5, "Classical": 3, "Films/Games": 3, "Metal": 4, "African Music": 7, "Asian Music": 5, "Blues": 5, "Brazilian Music": 6, "Indian Music": 4, "Latin Music": 7},
    "African Music": {"African Music": 10, "Pop": 6, "Kwaito": 8, "Rap/Hip Hop": 7, "Rock": 5, "Dance": 7, "R&B": 6, "Alternative": 5, "Christian": 5, "Electro": 6, "Folk": 5, "Reggae": 7, "Jazz": 4, "Classical": 3, "Films/Games": 4, "Metal": 4, "Soul & Funk": 7, "Asian Music": 5, "Blues": 5, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 6},
    "Asian Music": {"Asian Music": 10, "Pop": 5, "Kwaito": 5, "Rap/Hip Hop": 5, "Rock": 4, "Dance": 6, "R&B": 5, "Alternative": 4, "Christian": 4, "Electro": 6, "Folk": 5, "Reggae": 5, "Jazz": 4, "Classical": 4, "Films/Games": 3, "Metal": 4, "Soul & Funk": 5, "African Music": 5, "Blues": 4, "Brazilian Music": 4, "Indian Music": 5, "Latin Music": 5},
    "Blues": {"Blues": 10, "Pop": 4, "Kwaito": 4, "Rap/Hip Hop": 4, "Rock": 6, "Dance": 4, "R&B": 5, "Alternative": 5, "Christian": 3, "Electro": 4, "Folk": 6, "Reggae": 5, "Jazz": 6, "Classical": 5, "Films/Games": 4, "Metal": 5, "Soul & Funk": 5, "African Music": 5, "Asian Music": 4, "Brazilian Music": 5, "Indian Music": 4, "Latin Music": 5},
    "Brazilian Music": {"Brazilian Music": 10, "Pop": 5, "Kwaito": 5, "Rap/Hip Hop": 6, "Rock": 5, "Dance": 6, "R&B": 6, "Alternative": 5, "Christian": 4, "Electro": 5, "Folk": 5, "Reggae": 5, "Jazz": 5, "Classical": 4, "Films/Games": 3, "Metal": 5, "Soul & Funk": 6, "African Music": 5, "Asian Music": 4, "Blues": 5, "Indian Music": 4, "Latin Music": 7},
    "Indian Music": {"Indian Music": 10, "Pop": 4, "Kwaito": 3, "Rap/Hip Hop": 4, "Rock": 4, "Dance": 4, "R&B": 4, "Alternative": 4, "Christian": 4, "Electro": 4, "Folk": 5, "Reggae": 4, "Jazz": 4, "Classical": 4, "Films/Games": 3, "Metal": 4, "Soul & Funk": 4, "African Music": 4, "Asian Music": 5, "Blues": 4, "Brazilian Music": 4, "Latin Music": 5},
    "Latin Music": {"Latin Music": 10, "Pop": 8, "Kwaito": 7, "Rap/Hip Hop": 8, "Rock": 7, "Dance": 8, "R&B": 8, "Alternative": 6, "Christian": 5, "Electro": 7, "Folk": 6, "Reggae": 7, "Jazz": 5, "Classical": 3, "Films/Games": 4, "Metal": 5, "Soul & Funk": 7, "African Music": 6, "Asian Music": 5, "Blues": 5, "Brazilian Music": 7, "Indian Music": 5}
}


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
