import requests
import os
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

client_id = os.environ.get("CLIENT_ID")
client_secret = os.environ.get("CLIENT_SECRET")

ACCESS_KEY = os.environ.get("ACCESS_KEY")

credentials = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
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


def get_cluster_songs(song_name, artist):
    url = "https://echo-capstone-func-app.azurewebsites.net/api/get_songs"

    payload = {
        "access_key": ACCESS_KEY, 
        "song_name": song_name, 
        "artist": artist
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    text = json.loads(response.text)

    if response.status_code == 200:
        print("Request was successful.")
        return "spotify:track:" + text.get('original_id'), text.get('cluster_number'), text.get('recommended_tracks', [])
    else:
        print("Failed to send request.")
        print("Status code:", response.status_code)
        return None, None
    

def get_track_id(track_name, artist_name):
    results = sp.search(q=f'track:{track_name} artist:{artist_name}', type='track')
    items = results['tracks']['items']

    if items:
        return "spotify:track:" + items[0]['id']
    else:
        return None

    

def get_track_details(uri):
    track_id = uri.split(':')[-1]
    track_info = sp.track(track_id)
    track_name = track_info['name']
    artist_name = track_info['album']['artists'][0]['name'] if track_info['album']['artists'] else 'Unknown Artist'
    return track_name, artist_name


def get_genre(song_name, artist):
    url = "https://echo-classification.azurewebsites.net/api/get_genres"
    payload = {
        "access_key": ACCESS_KEY,
        "recommended_tracks": [
            {
                "track_name": song_name,
                "artist_name": artist
            }
        ]
    }

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        if "recommended_tracks" in response_data and len(response_data["recommended_tracks"]) > 0:
            genre = response_data["recommended_tracks"][0].get("genre", "Genre not found")
            return genre
        else:
            return None
    else:
        return None
    

def get_sentiment(song_name, artist):
    url = "https://echo-llm.azurewebsites.net/api/get_sentiments"
    payload = {
        "access_key": ACCESS_KEY,
        "recommended_tracks": [
            {
                "track_name": song_name,
                "artist_name": artist
            }
        ]
    }

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        if "recommended_tracks" in response_data and len(response_data["recommended_tracks"]) > 0:
            emotion = response_data["recommended_tracks"][0].get("emotion", "Sentiment not found")
            return emotion
        else:
            return None
    else:
        return None
    

def get_all_sentiments(songs):
    url = "https://echo-llm.azurewebsites.net/api/get_sentiments"
    payload = {
        "access_key": ACCESS_KEY,
        "recommended_tracks": songs
    }

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return None
    

def get_all_genres(songs):
    url = "https://echo-classification.azurewebsites.net/api/get_genres"
    payload = {
        "access_key": ACCESS_KEY,
        "recommended_tracks": songs
    }

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return None
