# ECHO Requirements Specification
> Halfstack: Capstone Project

# Table of contents
1. [User Stories](#user-stories)
2. [Functional Requirements](#functional-requirements)
3. [Service Contracts](#service-contracts)
4. [UML Class diagram](#uml-class-diagram)

## User Stories

1. As a User I want to:
   1. Register securely and create an account.
   1. Log in securely using my credentials.
   1. Reset my password if forgotten.
   1. Link my Spotify account to the application.
   1. Enjoy a smooth and responsive user experience.
   1. Access the app offline and view previous recommendations.
   1. Use the application on various devices and operating systems.

2. Listener
As a listener, I want to:
   1. Have all the functionality of a User
   1. View personalized song recommendations based on the song currently being listened to.
   1. Set custom recommendation categories.
   1. Receive recommendations based on an analysis of my selected song rather than general trends.
   1. View intuitive graphs and charts showing common themes and moods in my listening history.
   1. Toggle the dynamic UI feature on and off.
   1. Be able to view my listening habits, which include:
      1. Favourite genre
      2. Weekly listening trends, including what genres, archetypes and moods I tend towards throughout the week
      3. Frequent Lyrical archetypes(The general theme of the lyrics/ the story being conveyed)
      4. Outliers and new trends in my listening
   1. See recommended music.
   1. See other users with similar trends and/or habits.
   1. See recommendations based on my listening history.
   1. Customize my profile with preferred genres and moods.
   1. Receive notifications for new releases from my favorite artists.

3. As an Artist, I want to:
   1. Have all the functionality of a User
   1. See which moods my music is associated with.
   1. See recomended listening based on my music.
   1. See other artists who produce music similar to mine.
   1. Assign artist-defined tags to my music.
   1. View detailed analytics about listeners who enjoy my music.
   1. Get feedback from listeners on my songs.

## Functional Requirements

1. Provided a secure authentication process for user access
   1. Allow users to register on the application securely.
   2. Allow users to log into the application securely using their created credentials.
   3. Allow users to reset their passwords if forgotten.
   4. Allow users to log into their Spotify account to link it to the application.


2. Provide personalised song recommendations based on the song currently being listened to
   1. Provide users with song recommendations categorized by key, BPM, theme, and mood.
   2. Provide users with the option to set custom recommendation categories.
   3. Provide recommendations based on analysis (described in i.) of the user's selected song rather than general trends.


3. Sentiment Analysis system to analyze songs (based on key, BPM, genre) and categorize them based on abstract characteristics such as theme and mood.
   1. System must process the song’s lyrics and musical elements.
   2. Sentiment analysis must interpret the song’s emotional content.
   3. Sentiment analysis must categorise the song by theme and mood.
   4. Sentiment analysis must interpret lyrical content and musical elements to
      accurately gauge emotional resonance.


4. Generate and display insights about users' listening habits
   1. Users must be able to view intuitive graphs and charts showing common themes and moods in their listening history.
   2. Insights must provide meaningful knowledge about their musical interests.
   

5. Provide users with a dynamic User Interface
   1. The UI must dynamically adjust to reflect the user's mood based on the current song.
   2. Users must have the ability to toggle the dynamic UI feature on and off.
   3. The design should create an emotionally engaging user experience.


6. Ensure the application functions as a Progressive Web Application
   1. The application must be compatible with various devices and operating systems, including desktops, tablets, and smartphones.
   2. Offline functionality must be implemented to allow users to access the app without an internet connection, and view their previous recommendations.
   3. Application performance should be optimized to provide a smooth and responsive user experience.




## Service Contracts

## UML Class diagram
