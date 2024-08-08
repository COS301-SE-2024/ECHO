import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

credentials = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=credentials)

emotional_similarity = {
    "admiration": {"admiration": 10, "amusement": 7, "anger": 1, "annoyance": 2, "approval": 9, "caring": 6, "confusion": 3, "curiosity": 4, "desire": 5, "disappointment": 2, "disapproval": 1, "disgust": 1, "embarrassment": 2, "excitement": 7, "fear": 3, "gratitude": 8, "grief": 1, "joy": 8, "love": 9, "nervousness": 2, "optimism": 7, "pride": 9, "realization": 4, "relief": 5, "remorse": 2, "sadness": 1, "surprise": 4, "neutral": 5},
    "amusement": {"admiration": 7, "amusement": 10, "anger": 2, "annoyance": 3, "approval": 7, "caring": 5, "confusion": 3, "curiosity": 6, "desire": 6, "disappointment": 3, "disapproval": 2, "disgust": 1, "embarrassment": 4, "excitement": 8, "fear": 3, "gratitude": 7, "grief": 2, "joy": 8, "love": 6, "nervousness": 3, "optimism": 7, "pride": 6, "realization": 5, "relief": 5, "remorse": 3, "sadness": 2, "surprise": 6, "neutral": 5},
    "anger": {"admiration": 1, "amusement": 2, "anger": 10, "annoyance": 9, "approval": 2, "caring": 2, "confusion": 3, "curiosity": 1, "desire": 4, "disappointment": 7, "disapproval": 8, "disgust": 9, "embarrassment": 5, "excitement": 3, "fear": 8, "gratitude": 1, "grief": 4, "joy": 2, "love": 1, "nervousness": 6, "optimism": 2, "pride": 2, "realization": 3, "relief": 2, "remorse": 6, "sadness": 7, "surprise": 2, "neutral": 3},
    "annoyance": {"admiration": 2, "amusement": 3, "anger": 9, "annoyance": 10, "approval": 3, "caring": 3, "confusion": 4, "curiosity": 2, "desire": 4, "disappointment": 6, "disapproval": 7, "disgust": 8, "embarrassment": 6, "excitement": 3, "fear": 7, "gratitude": 2, "grief": 4, "joy": 3, "love": 2, "nervousness": 7, "optimism": 3, "pride": 3, "realization": 4, "relief": 3, "remorse": 6, "sadness": 6, "surprise": 3, "neutral": 3},
    "approval": {"admiration": 9, "amusement": 7, "anger": 2, "annoyance": 3, "approval": 10, "caring": 8, "confusion": 3, "curiosity": 5, "desire": 6, "disappointment": 3, "disapproval": 2, "disgust": 1, "embarrassment": 3, "excitement": 7, "fear": 3, "gratitude": 8, "grief": 2, "joy": 8, "love": 9, "nervousness": 3, "optimism": 7, "pride": 8, "realization": 5, "relief": 6, "remorse": 3, "sadness": 2, "surprise": 5, "neutral": 5},
    "caring": {"admiration": 6, "amusement": 5, "anger": 2, "annoyance": 3, "approval": 8, "caring": 10, "confusion": 3, "curiosity": 4, "desire": 6, "disappointment": 3, "disapproval": 2, "disgust": 2, "embarrassment": 4, "excitement": 6, "fear": 3, "gratitude": 8, "grief": 3, "joy": 7, "love": 9, "nervousness": 4, "optimism": 6, "pride": 7, "realization": 4, "relief": 6, "remorse": 3, "sadness": 2, "surprise": 4, "neutral": 5},
    "confusion": {"admiration": 3, "amusement": 3, "anger": 3, "annoyance": 4, "approval": 3, "caring": 3, "confusion": 10, "curiosity": 4, "desire": 4, "disappointment": 5, "disapproval": 4, "disgust": 3, "embarrassment": 5, "excitement": 4, "fear": 6, "gratitude": 3, "grief": 4, "joy": 3, "love": 3, "nervousness": 6, "optimism": 4, "pride": 3, "realization": 7, "relief": 3, "remorse": 5, "sadness": 4, "surprise": 7, "neutral": 6},
    "curiosity": {"admiration": 4, "amusement": 6, "anger": 1, "annoyance": 2, "approval": 5, "caring": 4, "confusion": 4, "curiosity": 10, "desire": 7, "disappointment": 2, "disapproval": 1, "disgust": 1, "embarrassment": 3, "excitement": 6, "fear": 2, "gratitude": 5, "grief": 2, "joy": 6, "love": 5, "nervousness": 3, "optimism": 6, "pride": 5, "realization": 8, "relief": 5, "remorse": 2, "sadness": 2, "surprise": 6, "neutral": 5},
    "desire": {"admiration": 5, "amusement": 6, "anger": 4, "annoyance": 4, "approval": 6, "caring": 6, "confusion": 4, "curiosity": 7, "desire": 10, "disappointment": 4, "disapproval": 3, "disgust": 3, "embarrassment": 5, "excitement": 7, "fear": 4, "gratitude": 6, "grief": 4, "joy": 7, "love": 7, "nervousness": 5, "optimism": 7, "pride": 6, "realization": 5, "relief": 6, "remorse": 4, "sadness": 4, "surprise": 6, "neutral": 5},
    "disappointment": {"admiration": 2, "amusement": 3, "anger": 7, "annoyance": 6, "approval": 3, "caring": 3, "confusion": 5, "curiosity": 2, "desire": 4, "disappointment": 10, "disapproval": 8, "disgust": 7, "embarrassment": 6, "excitement": 4, "fear": 7, "gratitude": 2, "grief": 6, "joy": 3, "love": 2, "nervousness": 7, "optimism": 3, "pride": 3, "realization": 5, "relief": 3, "remorse": 8, "sadness": 7, "surprise": 4, "neutral": 3},
    "disapproval": {"admiration": 1, "amusement": 2, "anger": 8, "annoyance": 7, "approval": 2, "caring": 2, "confusion": 4, "curiosity": 1, "desire": 3, "disappointment": 8, "disapproval": 10, "disgust": 8, "embarrassment": 5, "excitement": 2, "fear": 8, "gratitude": 1, "grief": 3, "joy": 2, "love": 1, "nervousness": 6, "optimism": 2, "pride": 2, "realization": 4, "relief": 2, "remorse": 6, "sadness": 8, "surprise": 2, "neutral": 4},
    "disgust": {"admiration": 1, "amusement": 1, "anger": 9, "annoyance": 8, "approval": 1, "caring": 2, "confusion": 3, "curiosity": 1, "desire": 3, "disappointment": 7, "disapproval": 8, "disgust": 10, "embarrassment": 6, "excitement": 2, "fear": 9, "gratitude": 1, "grief": 4, "joy": 1, "love": 1, "nervousness": 7, "optimism": 1, "pride": 1, "realization": 3, "relief": 1, "remorse": 4, "sadness": 9, "surprise": 2, "neutral": 3},
    "embarrassment": {"admiration": 2, "amusement": 4, "anger": 5, "annoyance": 6, "approval": 3, "caring": 4, "confusion": 5, "curiosity": 3, "desire": 5, "disappointment": 6, "disapproval": 5, "disgust": 6, "embarrassment": 10, "excitement": 4, "fear": 6, "gratitude": 3, "grief": 4, "joy": 4, "love": 3, "nervousness": 6, "optimism": 4, "pride": 4, "realization": 5, "relief": 4, "remorse": 6, "sadness": 5, "surprise": 5, "neutral": 4},
    "excitement": {"admiration": 7, "amusement": 8, "anger": 3, "annoyance": 3, "approval": 7, "caring": 6, "confusion": 4, "curiosity": 6, "desire": 7, "disappointment": 4, "disapproval": 2, "disgust": 2, "embarrassment": 4, "excitement": 10, "fear": 5, "gratitude": 7, "grief": 4, "joy": 9, "love": 7, "nervousness": 4, "optimism": 7, "pride": 7, "realization": 6, "relief": 6, "remorse": 4, "sadness": 4, "surprise": 6, "neutral": 6},
    "fear": {"admiration": 3, "amusement": 3, "anger": 8, "annoyance": 7, "approval": 3, "caring": 3, "confusion": 6, "curiosity": 2, "desire": 4, "disappointment": 7, "disapproval": 8, "disgust": 9, "embarrassment": 6, "excitement": 5, "fear": 10, "gratitude": 3, "grief": 4, "joy": 3, "love": 3, "nervousness": 7, "optimism": 3, "pride": 3, "realization": 6, "relief": 4, "remorse": 6, "sadness": 7, "surprise": 5, "neutral": 5},
    "gratitude": {"admiration": 8, "amusement": 7, "anger": 1, "annoyance": 2, "approval": 8, "caring": 8, "confusion": 3, "curiosity": 5, "desire": 6, "disappointment": 2, "disapproval": 1, "disgust": 1, "embarrassment": 3, "excitement": 7, "fear": 3, "gratitude": 10, "grief": 3, "joy": 8, "love": 9, "nervousness": 4, "optimism": 7, "pride": 8, "realization": 5, "relief": 6, "remorse": 3, "sadness": 2, "surprise": 5, "neutral": 5},
    "grief": {"admiration": 1, "amusement": 2, "anger": 4, "annoyance": 4, "approval": 2, "caring": 3, "confusion": 4, "curiosity": 2, "desire": 4, "disappointment": 6, "disapproval": 3, "disgust": 4, "embarrassment": 4, "excitement": 4, "fear": 4, "gratitude": 3, "grief": 10, "joy": 1, "love": 3, "nervousness": 4, "optimism": 3, "pride": 3, "realization": 5, "relief": 3, "remorse": 4, "sadness": 6, "surprise": 4, "neutral": 4},
    "joy": {"admiration": 8, "amusement": 8, "anger": 2, "annoyance": 3, "approval": 8, "caring": 7, "confusion": 3, "curiosity": 6, "desire": 7, "disappointment": 3, "disapproval": 2, "disgust": 1, "embarrassment": 4, "excitement": 9, "fear": 3, "gratitude": 8, "grief": 1, "joy": 10, "love": 9, "nervousness": 3, "optimism": 8, "pride": 8, "realization": 5, "relief": 7, "remorse": 3, "sadness": 1, "surprise": 6, "neutral": 5},
    "love": {"admiration": 9, "amusement": 6, "anger": 1, "annoyance": 2, "approval": 9, "caring": 9, "confusion": 3, "curiosity": 5, "desire": 7, "disappointment": 2, "disapproval": 1, "disgust": 1, "embarrassment": 3, "excitement": 7, "fear": 3, "gratitude": 9, "grief": 3, "joy": 9, "love": 10, "nervousness": 4, "optimism": 7, "pride": 9, "realization": 5, "relief": 6, "remorse": 3, "sadness": 2, "surprise": 5, "neutral": 5},
    "nervousness": {"admiration": 2, "amusement": 3, "anger": 6, "annoyance": 7, "approval": 3, "caring": 4, "confusion": 6, "curiosity": 3, "desire": 5, "disappointment": 7, "disapproval": 6, "disgust": 7, "embarrassment": 6, "excitement": 4, "fear": 7, "gratitude": 4, "grief": 4, "joy": 3, "love": 4, "nervousness": 10, "optimism": 4, "pride": 4, "realization": 6, "relief": 5, "remorse": 6, "sadness": 7, "surprise": 4, "neutral": 6},
    "optimism": {"admiration": 7, "amusement": 7, "anger": 2, "annoyance": 3, "approval": 7, "caring": 6, "confusion": 4, "curiosity": 6, "desire": 7, "disappointment": 3, "disapproval": 2, "disgust": 1, "embarrassment": 4, "excitement": 7, "fear": 3, "gratitude": 7, "grief": 3, "joy": 8, "love": 7, "nervousness": 4, "optimism": 10, "pride": 6, "realization": 5, "relief": 5, "remorse": 3, "sadness": 3, "surprise": 5, "neutral": 5},
    "pride": {"admiration": 8, "amusement": 6, "anger": 2, "annoyance": 3, "approval": 8, "caring": 5, "confusion": 3, "curiosity": 4, "desire": 5, "disappointment": 3, "disapproval": 2, "disgust": 1, "embarrassment": 4, "excitement": 7, "fear": 3, "gratitude": 8, "grief": 3, "joy": 8, "love": 9, "nervousness": 4, "optimism": 6, "pride": 10, "realization": 5, "relief": 6, "remorse": 3, "sadness": 3, "surprise": 5, "neutral": 5},
    "realization": {"admiration": 5, "amusement": 4, "anger": 6, "annoyance": 5, "approval": 5, "caring": 5, "confusion": 7, "curiosity": 5, "desire": 5, "disappointment": 6, "disapproval": 5, "disgust": 3, "embarrassment": 5, "excitement": 6, "fear": 6, "gratitude": 5, "grief": 5, "joy": 5, "love": 5, "nervousness": 6, "optimism": 5, "pride": 5, "realization": 10, "relief": 5, "remorse": 6, "sadness": 5, "surprise": 5, "neutral": 5},
    "relief": {"admiration": 4, "amusement": 4, "anger": 2, "annoyance": 3, "approval": 4, "caring": 4, "confusion": 3, "curiosity": 3, "desire": 3, "disappointment": 3, "disapproval": 3, "disgust": 1, "embarrassment": 4, "excitement": 6, "fear": 4, "gratitude": 6, "grief": 3, "joy": 7, "love": 6, "nervousness": 5, "optimism": 5, "pride": 6, "realization": 5, "relief": 10, "remorse": 3, "sadness": 3, "surprise": 5, "neutral": 4},
    "remorse": {"admiration": 2, "amusement": 3, "anger": 7, "annoyance": 6, "approval": 2, "caring": 4, "confusion": 5, "curiosity": 3, "desire": 4, "disappointment": 7, "disapproval": 6, "disgust": 4, "embarrassment": 6, "excitement": 4, "fear": 6, "gratitude": 3, "grief": 4, "joy": 3, "love": 3, "nervousness": 6, "optimism": 3, "pride": 3, "realization": 6, "relief": 3, "remorse": 10, "sadness": 7, "surprise": 4, "neutral": 5},
    "sadness": {"admiration": 3, "amusement": 3, "anger": 7, "annoyance": 7, "approval": 3, "caring": 5, "confusion": 6, "curiosity": 3, "desire": 4, "disappointment": 8, "disapproval": 7, "disgust": 8, "embarrassment": 5, "excitement": 4, "fear": 7, "gratitude": 2, "grief": 6, "joy": 1, "love": 2, "nervousness": 7, "optimism": 3, "pride": 3, "realization": 5, "relief": 3, "remorse": 7, "sadness": 10, "surprise": 3, "neutral": 5},
    "surprise": {"admiration": 4, "amusement": 7, "anger": 4, "annoyance": 3, "approval": 4, "caring": 3, "confusion": 6, "curiosity": 6, "desire": 4, "disappointment": 3, "disapproval": 3, "disgust": 2, "embarrassment": 5, "excitement": 6, "fear": 5, "gratitude": 5, "grief": 4, "joy": 6, "love": 5, "nervousness": 4, "optimism": 5, "pride": 5, "realization": 5, "relief": 5, "remorse": 4, "sadness": 3, "surprise": 10, "neutral": 4},
    "neutral": {"admiration": 5, "amusement": 5, "anger": 5, "annoyance": 5, "approval": 5, "caring": 5, "confusion": 6, "curiosity": 5, "desire": 5, "disappointment": 5, "disapproval": 5, "disgust": 3, "embarrassment": 4, "excitement": 6, "fear": 5, "gratitude": 5, "grief": 4, "joy": 5, "love": 5, "nervousness": 6, "optimism": 5, "pride": 5, "realization": 5, "relief": 4, "remorse": 5, "sadness": 5, "surprise": 4, "neutral": 10}
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
