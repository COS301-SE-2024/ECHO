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
- **Genre Detection:** Classifies songs 

## Implementation Details

### K-Means Clustering

### Sentiment Analysis

### Genre Detection

### Expert System Functionality

## Challenges and Future Work

## Conclusion

## Appendices