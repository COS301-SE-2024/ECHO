import requests

from openai import OpenAI
import os

client = OpenAI()

ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
LYRICS_TOKEN = os.environ.get("LYRICS_TOKEN")


def get_song_id(artist_name, song_name):
    search_url = 'http://api.musixmatch.com/ws/1.1/track.search'
    search_params = {
        'q_artist': artist_name,
        'q_track': song_name,
        'page_size': 1,         
        'page': 1,              
        'apikey': LYRICS_TOKEN
    }

    response = requests.get(search_url, params=search_params)
    data = response.json()

    if data['message']['header']['status_code'] == 200:
        track_list = data['message']['body']['track_list']
        if track_list:
            track_id = track_list[0]['track']['track_id']
            return track_id
        else:
            return None
    else:
        return None


def get_lyrics_by_id(song_name, artist):
    song_id = get_song_id(song_name, artist)

    if song_id is None:
        print("No song ID found")
        return None

    lyrics_url = 'http://api.musixmatch.com/ws/1.1/track.lyrics.get'
    lyrics_params = {
        'track_id': song_id,
        'apikey': LYRICS_TOKEN
    }

    response = requests.get(lyrics_url, params=lyrics_params)
    data = response.json()

    if data['message']['header']['status_code'] == 200:
        lyrics_body = data['message']['body']['lyrics']['lyrics_body']
        return lyrics_body
    else:
        print("No song lyrics found")
        return None
    

def get_lyrics_ovh(song_name, artist_name):
    url = f"https://api.lyrics.ovh/v1/{artist_name}/{song_name}"
    response = requests.get(url)
    print("response")

    if response.status_code == 200:
        lyrics = response.json().get("lyrics", "Lyrics not found.")
        return lyrics
    else:
        return None


def run_lyric_analysis(song_name, artist):
    sentiment = get_emotion_from_llm(song_name, artist)
    return sentiment

    lyrics = get_lyrics_ovh(song_name, artist)
    print("got lyrics")
    
    if lyrics is None:
        sentiment = get_emotion_from_llm(song_name, artist)
        return sentiment

    sentiment = get_sentiment(lyrics)
    print("got sentiment")
    return sentiment
    

def get_sentiment(lyrics):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "I am going to give you song lyrics. Please respond with one and only one of the following categories that the lyrics best fit into: Joy, Surprise, Sadness, Anger, Disgust, Contempt, Shame, Fear, Guilt, Excitement, Love. Please only respond with the ONE word."},
            {"role": "user", "content": lyrics}
        ]
    )

    if completion.choices and completion.choices[0].message:
        sentiment = completion.choices[0].message.content.strip()
        print("Sentiment: " + sentiment)
        valid_emotions = {"Joy", "Surprise", "Sadness", "Anger", "Disgust", "Contempt", "Shame", "Fear", "Guilt", "Excitement", "Love"}
        if sentiment in valid_emotions:
            return sentiment
        else:
            return "" 
    else:
        return ""


def get_emotion_from_llm(song_name, artist_name):
    prompt = f"The song '{song_name}' by '{artist_name}' doesn't have lyrics available. Based on what you know about this song, please predict the emotion it conveys. Respond with one and only one of the following emotions: Joy, Surprise, Sadness, Anger, Disgust, Contempt, Shame, Fear, Guilt, Excitement, Love. If you do not know the song, respond with an empty string."

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI model trained to predict emotions based on songs."},
            {"role": "user", "content": prompt}
        ]
    )

    if completion.choices and completion.choices[0].message:
        emotion = completion.choices[0].message.content.strip()
        print("Emotion: " + emotion)
        valid_emotions = {"Joy", "Surprise", "Sadness", "Anger", "Disgust", "Contempt", "Shame", "Fear", "Guilt", "Excitement", "Love"}
        if emotion in valid_emotions:
            return emotion
        else:
            return "" 
    else:
        return ""