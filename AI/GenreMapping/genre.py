import requests


def get_deezer_preview_url(song_name, artist_name):
    query = f"{song_name} {artist_name}"
    url = f"https://api.deezer.com/search?q={query}"
    response = requests.get(url)
    data = response.json()

    if data['total'] > 0:
        preview_url = data['data'][0]['preview']
        return preview_url
    else:
        return None


def get_album_genre(song_name, artist_name):
    query = f"{song_name} {artist_name}"
    url = f"https://api.deezer.com/search?q={query}"
    response = requests.get(url)
    data = response.json()

    if data['total'] > 0:
        song_id = data['data'][0]['id']
        song_url = f"https://api.deezer.com/track/{song_id}"
        song_response = requests.get(song_url)
        song_data = song_response.json()

        if 'album' in song_data:
            album_id = song_data['album']['id']
            album_url = f"https://api.deezer.com/album/{album_id}"
            album_response = requests.get(album_url)
            album_data = album_response.json()

            if 'genres' in album_data and 'data' in album_data['genres'] and len(album_data['genres']['data']) > 0:
                genre_name = album_data['genres']['data'][0]['name']
                return genre_name
            else:
                return ""
        else:
            return ""
    else:
        return ""
