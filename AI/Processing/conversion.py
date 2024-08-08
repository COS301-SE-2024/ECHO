import csv
import json

input_csv_file = 'expanded_details.csv'
output_json_file = 'songs.json'


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


csv_to_json(input_csv_file, output_json_file)