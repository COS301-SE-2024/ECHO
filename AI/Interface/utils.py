import requests
import os
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from openai import OpenAI

client_id = os.environ.get("CLIENT_ID")
client_secret = os.environ.get("CLIENT_SECRET")

ACCESS_KEY = os.environ.get("ACCESS_KEY")

credentials = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=credentials)

client = OpenAI()


def get_cluster_songs(song_name, artist, num_songs):
    url = "https://echo-capstone-func-app.azurewebsites.net/api/get_songs"
    print(song_name, artist)
    print(ACCESS_KEY)

    payload = {
        "access_key": ACCESS_KEY, 
        "song_name": song_name, 
        "artist": artist,
        "num_songs" : num_songs
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
        return None, None, None
    

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
    print("Track details found")
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


def get_genre_similarity_from_llm(genre1, genre2):
    prompt = f"On a scale of 1 to 10, how similar are the music genres '{genre1}' and '{genre2}'?"
    
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI model trained to predict how similar two music genres are."},
            {"role": "user", "content": prompt}
        ]
    )

    if completion.choices and completion.choices[0].message:
        similarity_score = completion.choices[0].message.content.strip()
        try:
            return int(similarity_score)  # Ensure it's a valid integer
        except ValueError:
            return 5  # Default to 5 if the response isn't a valid number
    else:
        return 5  # Default to a neutral similarity if the request fails
