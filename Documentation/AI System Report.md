# AI Music Recommendation System Report

## Introduction
This report details the implementation of an AI-based music recommendation system developed in Python and deployed as an Azure App Service. The system uses a dataset of 270k songs from the Spotify API to cluster songs based on various audio features and provide custom recommendations. Additionally, it imcorporates a custom sentiment analysis model to classify song lyrics into 28 categories, further refining the clustering process and enhancing recommendation quality. 

## Dataset

### Musical Features
The dataset was taken from Kaggle.com (278k Emotion Labeled Spotify Songs, uploaded by Abdullah Orzan). It consists of 270k songs, each described by the following features:
- **Acousticness:** A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 
- **Danceability:** Describes how suitable a track is for dancing. 
- **Energy:** A measure representing a perceptual measure of intensity and activity. 
- **Instrumentalness:** Predicts whether a track contains no vocals. Values above 0.5 represent instrumental tracks. 
- **Liveness:** Detects the presence of an audience in the recording. 
- **Loudness:** The overall loudness of a track in decibels (dB), typically between -60 and 0 dB.
- **Speechiness:** Detects the presence of spoken words in a track. Values above 0.66 describe tracks that are probably made entirely of spoken words, and values below 0.33 descrive tracks that are likely music. 
- **Valence:** A measure that describes the musical positiveness conveyed by a track. 
- **Tempo:** The overall estimated tempo of a track in beats per minute (BPM).

### Sentiment Labels
1. Admiration
2. Amusement
3. Anger
4. Annoyance
5. Approval
6. Caring
7. Confusion
8. Curiosity
9. Desire
10. Disappointment
11. Disapproval
12. Disgust
13. Embarrassment
14. Excitement
15. Fear
16. Gratitude
17. Grief
18. Joy
19. Love
20. Nervousness
21. Optimism
22. Pride
23. Realisation
24. Relief
25. Remorse
26. Sadness
27. Surprise
28. Neutral

## System Components

### Spotify API Integration
The system uses the Spotify API to fetch audio features and metadata for tracks. The integration is handled using the 'spotipy' library with OAuth authentication. 

### Clustering
The system clusters the songs based on their audio features using K-Means clustering. The clustering process groups similar songs together, making it easier to provide recommendations.
- **Standardisation:** The audio features are standardised to have a mean of 0 and a standard deviation of 1.
- **Loading and Scaling:** The scaled features are loaded from pre-saved files. 

Songs in the same cluster are assumed to have similar audio features. This alone cannot conclusively determine whether songs in the same cluster are similar enough to recommend to a user, so sentiment analysis and genre prediction are performed on songs that are "close together" in a cluster to increase the accuracy of the predictions. 

### Sentiment Analysis
The system incorporates a pre-trained sentiment analysis model, finetuned on the final layer, to classify song lyrics into 28 categories. This additional layer of analysis allows for more nuanced clustering and recommendations. The sentiment analysis process includes:
  1. **Preprocessing Lyrics:** Tokenising and cleaning the song lyrics to prepare them for analysis. 
  2. **Classification:** Using a machine learning model to classify the lyrics into one of the 26 sentimen categories. 
  3. **Integration with Audio Features:** Combining sentiment scores with audio features to enhance the clustering process. 

Lyrics for a particular song are returned as a web page from the Genius API, where a web scraper is used to gather lyric containers imbedded into the page's HTML. Each section of the provided song lyrics is cleaned and sent through the sentiment analysis model, which returns each emotional category with a corresponding score representing how strongly that emotion is present in the text. After all sections are processed, these scores are aggregated and the category with the highest score is returned as the overall sentiment of the song. 

### Recommendation System
The recommendation system finds songs similar to a given song by:
1.  Fetching the song's features.
2.  Identifying the closest cluster.
3.  Recommending songs from the same cluster that are closest in feature space.

## Azure App Service Deployment
The system is deployed as an Azure App Service, allowing it to be accessed via POST requests from ECHO's backend. This enables seamless integration with our other services and applications. 

### Azure Service Setup
The Azure Service is configured to handle POST requests that include the song name and artist. It processes the request, fetches the song features, and returns a list of recommended songs. 
