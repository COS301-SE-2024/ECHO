# ECHO Requirements Specification
> Halfstack: Capstone Project

# Table of contents
- [ECHO Requirements Specification](#echo-requirements-specification)
- [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
    - [Vision and Mission](#vision-and-mission)
    - [Business Needs](#business-needs)
    - [Project Scope](#project-scope)
  - [User Stories](#user-stories)
  - [Functional Requirements](#functional-requirements)
  - [Service Contracts](#service-contracts)
  - [UML Class diagram](#uml-class-diagram)

## Introduction

### Vision and Mission
Our vision for the application is the redefinition of music personalisation. What we hope to achieve is an intelligent platform that suggests music based on mood, theme, time signature and BPM but also gives deep insights on listening habits, emotional engagement, and trends. These suggestions will be based on the user's own listening history. We want to give users a seamless, dynamic user experience with respect to their mood and preferences - with a dynamic UI to match!

### Business Needs
Traditional recommendation systems are simply ineffective, particularly in offering a personalised array of music suggestions. These systems recommend music to users based on other users' listening history/preferences - not their own. Our application fills up this gap by using sentiment analysis to recommend songs by categories (like mood, theme, time signature and BPM) compiled based on the user's own listening history. This raises not only the degree of personalisation available to music streamers but also increases the likelihood of matching artists with those who match their target market. This application is a unique and effective approach in increasing personalisation unavailable by any music streaming services in the market right now.

### Project Scope
ECHO is a Progressive Web Application that interacts with the Spotify API and takes users' music experience to new heights. The primary use cases include safe user authentication, on-demand playlist, real-time content, and offline access. The user can track in-depth analysis data based on listening patterns through user-friendly and intuitive graphs and charts. Available on all devices, desktop, tablet, and smartphone, with multi-platform assured compatibility for streaming services. And provide exclusive functions for both listeners and artists, such as mood-matched music association, listener analytics, and mechanisms for user feedback. By satisfying these core necessities and functionalities, our application aspires to set a new benchmark in music recommendation and user engagement toward an encompassing solution, both for music lovers and artists.


## User Stories

1. As a User I want to:
   1. Register securely and create an account.
   1. Log in securely using my credentials.
   1. Reset my password if forgotten.
   1. Link my Spotify account to the application.
   1. Enjoy a smooth and responsive user experience.
   1. Access the app offline and view previous recommendations.
   1. Use the application on various devices and operating systems.

2. As a Listener, I want to:
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

1. **User Registration**
   - **Request**: When I request to register securely and create an account with the following details `{ username, email, password }`, 
   - **Response**: I expect a response in the form of `{ userId, username, email, status: 'registered' }`.

2. **User Login**
   - **Request**: When I request to log in securely using my credentials `{ username, password }`, 
   - **Response**: I expect a response in the form of `{ userId, username, token, status: 'loggedIn' }`.

3. **Password Reset**
   - **Request**: When I request to reset my password with the following details `{ email }`, 
   - **Response**: I expect a response in the form of `{ email, status: 'resetLinkSent' }`.

4. **Link Spotify Account**
   - **Request**: When I request to link my Spotify account with the application using `{ spotifyToken }`, 
   - **Response**: I expect a response in the form of `{ userId, spotifyLinked: true }`.

5. **Personalized Song Recommendations**
   - **Request**: When I request personalized song recommendations based on the song currently being listened to `{ songId }`, 
   - **Response**: I expect a response in the form of `{ recommendations: [ { songId, title, artist, key, BPM, theme, mood } ] }`.

6. **Custom Recommendation Categories**
   - **Request**: When I request to set custom recommendation categories `{ userId, categories: [ { category, value } ] }`, 
   - **Response**: I expect a response in the form of `{ userId, categoriesSet: true }`.

7. **Recommendation Based on Analysis**
   - **Request**: When I request recommendations based on analysis of my selected song `{ songId }`, 
   - **Response**: I expect a response in the form of `{ recommendations: [ { songId, title, artist, key, BPM, theme, mood } ] }`.

8. **Sentiment Analysis of Songs**
   - **Request**: When I request sentiment analysis for a song `{ songId }`, 
   - **Response**: I expect a response in the form of `{ songId, theme, mood, emotionalContent }`.

9. **User Listening Habits Insights**
   - **Request**: When I request insights about my listening habits `{ userId }`, 
   - **Response**: I expect a response in the form of `{ userId, insights: { favouriteGenre, weeklyTrends, lyricalArchetypes, newTrends } }`.

10. **Intuitive Graphs and Charts**
    - **Request**: When I request to view graphs and charts of my listening history `{ userId }`, 
    - **Response**: I expect a response in the form of `{ userId, charts: [ { type, data } ] }`.

11. **Dynamic User Interface Toggle**
    - **Request**: When I request to toggle the dynamic UI feature on or off `{ userId, toggle: true/false }`, 
    - **Response**: I expect a response in the form of `{ userId, dynamicUIToggled: true/false }`.

12. **Cross-Platform Compatibility**
    - **Request**: When I request the application on different devices and operating systems, 
    - **Response**: I expect a response in the form of `{ compatible: true }`.

13. **Offline Functionality**
    - **Request**: When I request to access the app offline and view previous recommendations `{ userId }`, 
    - **Response**: I expect a response in the form of `{ userId, offlineAccess: true, recommendations: [ { songId, title, artist, key, BPM, theme, mood } ] }`.

14. **Smooth and Responsive User Experience**
    - **Request**: When I request to use the application,
    - **Response**: I expect a response in the form of `{ performance: 'optimized', status: 'smoothExperience' }`.

15. **Listening History Recommendations**
    - **Request**: When I request recommendations based on my listening history `{ userId }`, 
    - **Response**: I expect a response in the form of `{ userId, recommendations: [ { songId, title, artist, key, BPM, theme, mood } ] }`.

16. **Other Users with Similar Trends**
    - **Request**: When I request to see other users with similar trends and habits `{ userId }`, 
    - **Response**: I expect a response in the form of `{ userId, similarUsers: [ { userId, username, commonTrends } ] }`.

17. **Custom Profile Preferences**
    - **Request**: When I request to customize my profile with preferred genres and moods `{ userId, preferences: { genres, moods } }`, 
    - **Response**: I expect a response in the form of `{ userId, preferencesSet: true }`.

18. **Notifications for New Releases**
    - **Request**: When I request to receive notifications for new releases from my favorite artists `{ userId, favoriteArtists: [ artistId ] }`, 
    - **Response**: I expect a response in the form of `{ userId, notificationsSet: true }`.

19. **Artist Mood Association**
    - **Request**: When I request to see which moods my music is associated with `{ artistId }`, 
    - **Response**: I expect a response in the form of `{ artistId, moodAssociations: [ { songId, mood } ] }`.

20. **Recommended Listening Based on My Music**
    - **Request**: When I request recommended listening based on my music `{ artistId }`, 
    - **Response**: I expect a response in the form of `{ artistId, recommendations: [ { songId, title, artist, key, BPM, theme, mood } ] }`.

21. **Similar Artists**
    - **Request**: When I request to see other artists who produce music similar to mine `{ artistId }`, 
    - **Response**: I expect a response in the form of `{ artistId, similarArtists: [ { artistId, name, commonGenres } ] }`.

22. **Artist-Defined Tags**
    - **Request**: When I request to assign tags to my music `{ artistId, tags: [ { songId, tag } ] }`, 
    - **Response**: I expect a response in the form of `{ artistId, tagsAssigned: true }`.

23. **Listener Analytics**
    - **Request**: When I request detailed analytics about listeners who enjoy my music `{ artistId }`, 
    - **Response**: I expect a response in the form of `{ artistId, analytics: { listenerDemographics, listenerPreferences, listeningTrends } }`.

24. **Feedback from Listeners**
    - **Request**: When I request to get feedback from listeners on my songs `{ artistId }`, 
    - **Response**: I expect a response in the form of `{ artistId, feedback: [ { songId, userId, comment, rating } ] }`.


## UML Class diagram
