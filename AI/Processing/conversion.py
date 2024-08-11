import csv
import json


def csv_to_json(input_csv_file, output_json_file):
    with open(input_csv_file, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        songs = []
        for row in csv_reader:
            song_features_str = row.get('Song Features', '')
            if song_features_str and song_features_str.lower() != 'none':
                try:
                    song_features = json.loads(song_features_str.replace("'", "\""))
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON for row: {row}")
                    song_features = {}
            else:
                song_features = {}

            song = {
                'Song Name': row.get('Song Name', '') or '',
                'Artist': row.get('Artist', '') or '',
                'Track ID': row.get('Track ID', '') or '',
                'Song Features': song_features,
                'Cluster Number': row.get('Cluster Number', '') or '',
                'Emotion': row.get('Emotion', '') or '',
                'Predicted Genre': row.get('Predicted Genre', '') or '',
                'Album Genre': row.get('Album Genre', '') or ''
            }
            songs.append(song)
    
    with open(output_json_file, mode='w', encoding='utf-8') as json_file:
        json.dump(songs, json_file, indent=4)


def update_csv():
    with open('songs.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    filtered_data = []

    for song in data:
        filtered_song = {
            "SongName": song.get("Song Name", ""),
            "Artist": song.get("Artist", ""),
            "URI": song.get("Song Features", {}).get("uri", ""),
            "ClusterNumber": song.get("Cluster Number", ""),
            "Emotion": song.get("Emotion", ""),
            "AlbumGenre": song.get("Album Genre", "")
        }
        filtered_data.append(filtered_song)

    output_file = "filtered_songs.json"

    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(filtered_data, file, ensure_ascii=False, indent=4)

    print(f"Filtered data written to {output_file}")


update_csv()