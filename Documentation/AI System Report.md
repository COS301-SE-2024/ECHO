# System Report: AI-Based Music Recommendation System

## Introduction
The AI-Based Music Recommendation System described in this report is designed to deliver highly personalised music siggestions by analysing new songs submitted by users. This system leverages advanced AI techniques, including K-Means clustering and sentiment analysis, to provide accurate and relevant music recommendations. 

This system is intended for integration within ECHO, our Progressive Web App (PWA), making it accessible across various devices and platforms. The PWA interface will enable users to play songs easily, receive recommendations based on songs they listen to, and interact with the system in real time. The primary objective of the system is to enhance the user's music discovery experience by using AI-driven insights to suggest songs that responate with their tastes and emotions. 

Overall, this report outlines the architecture and implementation of the system, providing an overview of how it operates and its potential impact on the music recommendation landscape. 

## System Architecture
The architecture of the Music Recommendation System is designed with scalability, modularity and flexibility in mind. The system is composed of multiple components, each deployed as a separate Azure Function App. This distributed architecture allows for efficient processing of incoming song data, ensuring that each functional aspect of the system can be managed independently while still contributing to the overall recommendation process. 

### High-Level Design
At a high-level, the system consists of three primary modules:
- **K-Means Clustering:** Groups songs into similar clusters based on their features, enabling the system to identify songs that are similar in terms of musical attributes. 
- **Sentiment Analysis:** Analyses the lyrics of songs to determine the emotional tone, which is used to categorise songs by mood. 
- **Genre Detection:** Classifies songs into specific genres, aiding the recommendation process by ensuring that genre preferences are respected. 

Each module of the system is encapsulated within its own Azure Function APp. This microservices-based approach allows for each component to be scaled independently based on demand. These modules are accessed through an **Expert System Interface**, which integrates the results from each module to provide personalised music recommendations. The entire system is accessed through a PWA, which provides the user with an interface for receiving recommendations. 

### Database and Data Storage
The system uses Azure CosmosDB to store song data, clustering information, sentiment analysis results, and genre classifications. This database is accessed by the Expert System Interface to retrieve and store data as needed. The database also keeps track of previouslt generated recommendations, allowing the system to return cached results when appropriate. 

## Implementation Details

### K-Means Clustering
The K-Means Clustering system is responsible for grouping songs into clusters based on their musical attributes. This clustering enables the system to identify and recommend songs that are similar to a given track, enhancing the relevance of the recommendations provided to the users. 

#### Overview of the Clustering Process
The clustering process is driven by the K-Means algorithm, which is a well-known unsupervised learning method for partitioning data into distinct clusters. In this system, each songs is represented by a sest of features that capture various musical aspects, such as tempo, loudness, and danceability. The clustering algorithm groups songs into clusters based on these features, allowing the system to easily retrieve and recommend similar tracks. 

#### Features Used for Clustering
The clustering system uses the following musical features to represent each song:
- **'duration_ms':** The length of the song in milliseconds.
- **'danceability':** A measure of how suitable a track is for dancing, based on a combination of musical elements.
- **'energy':** A measure of intensity and activity in the track. 
- **'loudness':** The overall loudness of the track in decibels.
- **'speechiness':** A measure of the presence of spoken words in the track.
- **'acousticness':** A measure of the likelihood that the track is acoustic.
- **'instrumentalness':** A measure of the likelihood that the track contains no vocals.
- **'liveness':** A measure of the presence of a live audience in the track.
- **'valence':** A measure of the musical positiveness conveyed by the track.
- **'tempo':** The speed or pace of the track.

These features are normalised using a trained scaler before being passed to the clustering algorithm, which ensures that all features contribute equally to the clustering process regardless of their original scale. 

#### Song Recommendation Process
The core functionality of the clustering system is to recommend songs based on their proximity to the centroid of a cluster. This is done through the following steps:
1. **Input Song Feature Extraction:** The features of the input song (provided by the user) are extracted and normalised using the pre-trained scaler. 
2. **Cluster Assignment:** The input song's features are compared to the centroids of all clusters using Euclidean distance. The song is assigned to the closest cluster, identified by the minimum distance to the centroid.
3. **Existing Song Check:** The system checks if the song is already present in the cluster. If it is, the song is excluded from the list of recommendations to avoid self-recommendation.
4. **Similar Song Selection:** The system selects a random subset of songs from the same cluster as potential recommendations. These songs are chosen based on their proximity to the input song within the cluster. A certain number of closest songs are then recommended to the user. 
5. **Recommendation Generation:** The selected songs are returned as recommendations, ensuring that they share similar musical attributes with the input song. 

### Sentiment Analysis
The Sentiment Analysis system in the Music Recommendation System plays a crucial role in understanding the emotional tone conveyed by the lyrics of a song. This information is then used to enhance the personalisation of music recommendations, ensuring that users receive songs that not only match their genre preferences but also resonate with their current mood or emotional state.

#### Overview of the Sentiment Analysis Process
The sentiment analysis process involved analysing the lyrics of a song to determine the dominant emotion conveyed by the text. The system uses a combination of natural language processing (NLP) techniques and large language models (LLMs) to categorise lyrics into specific emotional labels. These labels are then used as a factor in the recommendation engine, allowing the system to suggest songs that match the emotional tone of the user's preferences or current listening context. 

#### Lyrics Retrieval and Analysis
The sentiment analysis process begins with the retrieval of song lyrics. This is accomplished using various methods depending ont he availability of the lyrics data:
1. **Lyrics Retrieval via API:**
   - **Musixmatch API:** The system first attempts to retrieve lyrics using the Musixmatch API by searching for the song and artist names. If a matching song is found, the lyrics are fetched using the track ID.
   - **OVH Lyrics API:** As a fallback, the system uses the OVH Lyrics API to retrieve lyrics directly by providing the song and artist names. This ensures that the system can handle cases where the primary API does not return results. 
2. **Lyrics Analysis:** Once the lyrics are retrieved, the system performs sentiment analysis. This function first attempts to analyse the lyrics directly. If lyrics are not available or cannot be retrieved, the system generates an emotion prediction based on the song and artist names using an LLM (GPT-based model).
3. **Sentiment Classification:** 
   - **LLM Sentiment Classification:** The primary method for determining the sentiment of the lyrics involves using an LLM (GPT-4). The model is prompted with the lyrics and asked to categorise them into one of several predefined emotion categories, such as 'Joy', 'Sadness', 'Anger', etc. The model is specifically instructed to select the best-fitting emotion based on the content of the lyrics. 
   - **LLM Emotion Prediction Without Lyrics:** If lyrics are not available for a given song, the system falls back on an LLM to predict the likely emotion based on the song's title and artist. This prediction is based on general knowledge and patterns associated wiht similar songs.  

### Genre Detection
The Genre Detection system is a critical component of the Music Recommendation System, responsible for identifying the genre of a song. This information is used to tailor recommendations based on users' genre preferences, ensuring that the suggested tracks align with their musical tastes. 

#### Overview of the Genre Detection Process
The genre detection process involved determining the genre of a song by analysing its metadata and leveraging external APIs to obtain accurate genre information. The system identifies the genre of a song by querying Deezer's extensive music database, ehich provides genre classification at the album level. This ensures that the system can provide reliable genre information even for less mainstream tracks. 

#### Interaction with Deezer API
The genre detection process is heavily reliant on the Deezer API, which is used to search for the song and retrieve its associated metadata, including its genre. The process works as follows:
1. **Song and Artist Query:** The system constructs a query string using the song name and artist name provided by the user. This query is then sent to the Deezer API to search for matching tracks in Deezer's music database. 
2. **Retrieving Album Information:** If a matching song is found, the system retrieves detailed information about the track, including the album it belongs to. The genre information is typically associated with the album rather than individual tracks, so obtaining the album details is crucial. 
3. **Extracting Genre Data:** Once the album information is retrieved, the system checks for genre data within the album's metadata. If genre information is available, it is extracted and returned as the genre of the song. 
4. **Fallback Mechanism:** In cases where the genre information is not available or the track is not found in Deezer's database, the system returns an empty string of attempts to infer the genre using alternative methods. However, reliance on Deezer ensures that the genre detection process is generally accurate and reliable, 

### Expert System Functionality
The Expert System Interface is the central component that orchestrates the interaction between the various modules of the Music Recommendation System, including the K-Means Clustering, Sentiment Analysis, and Genre Detection modules. It serves as the integration point where all the analytical outputs are combined to generate personalised music recommendations for users. The interface is implemented as an Azure Function, enabling scalable and secure access to the system's functionalities. 

#### Overview of the Interface
The Expert System Interface is designed to process user requests, manage data retrieval and analysis, and generate recommendations based on the combined outputs of the clustering, sentiment analysis, and genre detection modules. 

#### Azure Function Implementation
The core of the interface is encapsulated within an Azure Function that handles HTTP requests. This function is responsible for processing the user's request, performing necessary validations, and invoking the relevant modules to generate recommendations.
1. **Input Validation:** The function first validates the input request, ensuring that the necessary parameters, such as the song name and artist, are provided. It also checks for the presence of an access key to ensure that only authorised requests are processed. 
2. **Data Retrieval:** The function attempts to retrieve existing data for the requested song from the database. If the song is already stored, it uses the stored data to generate recommendations without reprocessing the song through the various modules. 
3. **Cluster Assignment and Song Retrieval:** If the song is not found in the database, the function invoked the K-Means Clustering module to assign the song to a cluster and retrieve similar songs from the same cluster. 
4. **Sentiment and Genre Analysis:** The function performs sentiment analysis and genre detection on the input song and the similar songs retrieved from the cluster using the corresponding Azure Functions for sentiment analysis and genre detection. The results are used to filter and rank the similar songs.
5. **Recommendation Generation:** The function combines the clustering, sentiment, and genre data to generate a lsit of recommended songs. It prioritises songs that share similar emotional tones and genres with the imput song. 
6. **Storing Recommendations:** The generated recommendations are stored in the database for future reference. This allows the system to return cached results if the same song is requested again. 

## Challenges and Future Work

### Challenges
During the development and deployment of the Music Recommendation System, several significant challenges were encountered:
- **Inconsistent Genre Data:** Reliance on external APIs such as Deezer for genre detection led to inconsistencies in data availability and accuracy. This resulted in cases where genre information was missing or incorrect, which impacted the quality of recommendations. 
- **Cluster Quality:** The K-Means clustering algotithm's effectiveness was influenced by the quality of input data, sometimes resulting in clusters that were not sufficiently distinct. This necessitated adjustments to the clustering features and the number of clusters to enhance recommendation relevance. 
- **Sentiment Misclassification:** The sentiment analysis module occasionally misclassified songs, particularly those with ambiguous or complex lyrics, which affected the overall recommendation quality. 
- **Ensuring 10 Recommendations:** Maintaining exactly 10 song recommendations posed a challenge, especially when the initial pool of cluster songs was insufficient. This required careful management of the recommendation process to balance quality and relevance. 
- **Deplyoment Issues:** Deployment presented significant challenges, particularly with custom-built models for text and audio classification. These models, which worked well during development, failed during deployment, requiring the system to be rebuilt almost from scratch. Additionally, a custom web scraper that was integrated into the system for lyric detection did not function as expected in the deployment environment, further complicating the process. 

### Future Work
To address the challenges encountered and to anhance the system's capabilities, the following improvements are planned:
- **Genre Detection Failsafe:** Implementing a failsafe mechanism in the genre detection module will help ensure that if a song is not found in Deezer's database, the system will attemp to retrieve the genre from an album by the same artist. This will reduce the impact of missing or inaccurate genre data and improve recommendation reliability.
- **Guaranteed 10 Recommendations:** The system will be modified to consistently recommend exactly 10 songs. If the initial set of cluster songs is insufficient, the system will either truncate the list at 10 songs or continue the process with additional cluster songs, ensuring a consistent user experience. 
- **Language Detection and Profanity Filtering:** Future iterations will include language detection and profanity filtering, allowing the system to tailor recommendations based on language preferences and to filter out explicit content when necessary. This will enhance the system's adaptability to diverse user needs.
- **User Feedback Integration:** Incorporating user feedback into the recommendation process will be a key focus. By allowing users to rate recommendations and provide feedback, the system can learn and adapt over time, leading to more personalised and accurate recommendations. 

## Appendices