# ECHO Requirements Specification
<br />

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
  - [1.1 Register](#11-register)
  - [1.2 Login](#12-login)
  - [1.3 Reset Password](#13-reset-password)
  - [1.4 Link Spotify Account](#14-link-spotify-account)
  - [1.5 Upload Profile Picture](#15-upload-profile-picture)
  - [1.6 View Recommendations](#16-view-recommendations)
  - [1.7 Set Custom Recommendation Categories](#17-set-custom-recommendation-categories)
  - [1.8 View Listening Insights](#18-view-listening-insights)
  - [1.9 Customize Profile](#19-customize-profile)
  - [1.10 View Artist Analytics](#110-view-artist-analytics)
- [Use Case Diagrams](#use-case-diagrams)
  - [1. User Management Subsystem](#1-user-management-subsystem)
  - [2. Profile Management Subsystem](#2-profile-management-subsystem)
  - [3. Analytics Display Subsystem](#3-analytics-display-subsystem)
  - [4. AI Processing Subsystem](#4-ai-processing-subsystem)
- [UML Class Diagram](#uml-class-diagram)
- [Design Patterns](#design-patterns)
  - [Observer](#observer)
  - [Singleton](#singleton)
  - [Adapter](#adapter)
  

<br />
<br />

# Introduction

### Vision and Mission
Our vision for the application is the redefinition of music personalisation. What we hope to achieve is an intelligent platform that suggests music based on mood, theme, time signature and BPM but also gives deep insights on listening habits, emotional engagement, and trends. These suggestions will be based on the user's own listening history. We want to give users a seamless, dynamic user experience with respect to their mood and preferences - with a dynamic UI to match!

### Business Needs
Traditional recommendation systems are simply ineffective, particularly in offering a personalised array of music suggestions. These systems recommend music to users based on other users' listening history/preferences - not their own. Our application fills up this gap by using sentiment analysis to recommend songs by categories (like mood, theme, time signature and BPM) compiled based on the user's own listening history. This raises not only the degree of personalisation available to music streamers but also increases the likelihood of matching artists with those who match their target market. This application is a unique and effective approach in increasing personalisation unavailable by any music streaming services in the market right now.

### Project Scope
ECHO is a Progressive Web Application that interacts with the Spotify API and takes users' music experience to new heights. The primary use cases include safe user authentication, on-demand playlist, real-time content, and offline access. The user can track in-depth analysis data based on listening patterns through user-friendly and intuitive graphs and charts. Available on all devices, desktop, tablet, and smartphone, with multi-platform assured compatibility for streaming services. And provide exclusive functions for both listeners and artists, such as mood-matched music association, listener analytics, and mechanisms for user feedback. By satisfying these core necessities and functionalities, our application aspires to set a new benchmark in music recommendation and user engagement toward an encompassing solution, both for music lovers and artists.

<br />
<br />

# User Stories

1. ### As a User I want to:
   1. Register securely and create an account.
   1. Log in securely using my credentials.
   1. Reset my password if forgotten.
   1. Link my Spotify account to the application.
   1. Enjoy a smooth and responsive user experience.
   1. Access the app offline and view previous recommendations.
   1. Use the application on various devices and operating systems.

2. ### As a Listener, I want to:
   1. Have all the functionality of a User
   1. View personalised song recommendations based on the song currently being listened to.
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

3. ### As an Artist, I want to:
   1. Have all the functionality of a User
   1. See which moods my music is associated with.
   1. See recomended listening based on my music.
   1. See other artists who produce music similar to mine.
   1. Assign artist-defined tags to my music.
   1. View detailed analytics about listeners who enjoy my music.
   1. Get feedback from listeners on my songs.

<br />
<br />

# Functional Requirements

1. Provided a secure authentication process for user access
   1. Allow users to register on the application securely.
   2. Allow users to log into the application securely using their created credentials.
   3. Allow users to reset their passwords if forgotten.
   4. Allow users to log into their Spotify account to link it to the application.


2. Provide personalised song recommendations based on the song currently being listened to
   1. Provide users with song recommendations categorized by key, BPM, theme, and mood.
   2. Provide users with the option to set custom recommendation categories.
   3. Provide recommendations based on analysis (described in i.) of the user's selected song rather than general trends.


3. Sentiment Analysis system to analyze songs' lyrics and categorize them based on abstract characteristics such as theme and mood.
   1. System must process the song’s lyrics.
   2. Sentiment analysis must interpret the song’s emotional content.
   3. Sentiment analysis must categorise the song by theme and mood.
   4. Sentiment analysis must interpret lyrical content to accurately gauge emotional resonance.

4. K-Means Clustering system to group songs based on musical features and sentiment scores. 
   1. System must receive the musical features for each song, which includes a sentiment score. 
   2. Clustering must group similar songs using K-Means clustering.
   3. Clustering must handle updates to clusters when new songs are added to the dataset. 


5. Generate and display insights about users' listening habits
   1. Users must be able to view intuitive graphs and charts showing common themes and moods in their listening history.
   2. Insights must provide meaningful knowledge about their musical interests.
   

6. Provide users with a dynamic User Interface
   1. The UI must dynamically adjust to reflect the user's mood based on the current song.
   2. Users must have the ability to toggle the dynamic UI feature on and off.
   3. The design should create an emotionally engaging user experience.


7. Ensure the application functions as a Progressive Web Application
   1. The application must be compatible with various devices and operating systems, including desktops, tablets, and smartphones.
   2. Offline functionality must be implemented to allow users to access the app without an internet connection, and view their previous recommendations.
   3. Application performance should be optimized to provide a smooth and responsive user experience.

<br />
<br />

# Service Contracts

## 1.1 Register
**Service Contract Name:** New user is registered.

**Pre-conditions:**
- The user must not be a registered user.
- User information (name, email, and password) must be provided.
- The user must have a valid Spotify account.

**Post-conditions:**
- A registered user is created.
- The user's Spotify account is linked to their profile.
- The user is navigated to the main/landing page.

**Actors:**
- User

**Scenario:**
The user accesses the registration page, enters their details, and submits the form. The system prompts the user to link their Spotify account. The user logs into Spotify and grants the necessary permissions. The system verifies the details, creates a new account, links the Spotify account to the user's profile, and navigates the user to the main/landing page.

## 1.2 Login
**Service Contract Name:** User is logged in.

**Pre-conditions:**
- The user must be a registered user.
- A valid registered email address and password must be provided.

**Post-conditions:**
- The user is signed into the system and navigated to the main/landing page.

**Actors:**
- User

**Scenario:**
The user enters their email and password on the login page. The system verifies the credentials and either grants access, navigating the user to the main/landing page, or denies access and prompts them to try again.

## 1.3 Reset Password
**Service Contract Name:** User's password is reset.

**Pre-conditions:**
- The user must be a registered user with a verified email.

**Post-conditions:**
- The user's password is reset.
- The user is navigated to the login page.

**Actors:**
- User

**Scenario:**
The user clicks "forgot password," enters their verified email, and receives a reset link. They set a new password via the reset link and are then navigated to the login page.


## 1.4 Link Spotify Account
**Service Contract Name:** User's account is linked to Spotify.

**Pre-conditions:**
- The user must be in the process of registering a new account.
- The user must have a valid Spotify account.

**Post-conditions:**
- The user's Spotify account is linked to their profile.
- The user's registration process is completed.

**Actors:**
- User

**Scenario:**
The user initiates the registration process and is prompted to link their Spotify account. The user logs into Spotify and grants the necessary permissions. The system links the Spotify account to the user's profile, completing the registration process.

## 1.5 Upload Profile Picture
**Service Contract Name:** User uploads a profile picture.

**Pre-conditions:**
- The user must provide a valid image file.

**Post-conditions:**
- The image is uploaded to the storage service.
- The path to the image is associated with the specific user in the database.
- The user's profile picture is updated to be the uploaded image. 

**Actors:**
- User

**Scenario:**
The user selects an image to upload. The system stores the image and updates the user profile with the image path. The system now displays the uploaded image as the user's profile picture.

## 1.6 View Recommendations
**Service Contract Name:** User views song recommendations.

**Pre-conditions:**
- The user must be logged into the system.

**Post-conditions:**
- Personalised song recommendations are displayed based on the user's listening history and current song.

**Actors:**
- Listener

**Scenario:**
The listener views the recommendations page, where the system fetches and displays personalised song recommendations based on various parameters.

## 1.7 Set Custom Recommendation Categories
**Service Contract Name:** User sets custom recommendations categories to prioritise on their profile.

**Pre-conditions:**
- The user must be logged into the system.

**Post-conditions:**
- The user's custom recommendation categories are saved on their account.

**Actors:**
- Listener

**Scenario:**
The listener sets custom categories for song recommendations. The system saves these preferences and uses them for future song recommendations.

## 1.8 View Listening Insights
**Service Contract Name:** User views highlights that display their listening insights.

**Pre-conditions:**
- The user must be logged into the system.

**Post-conditions:**
- Intuitive graphs and charts showing listening habits are displayed.

**Actors:**
- Listener

**Scenario:**
The listener accesses the insights page. The system fetches and displays various graphs and charts based on the user's listening history.

## 1.9 Customize Profile
**Service Contract Name:** User customises profile to meet their tastes.

**Pre-conditions:**
- The user must be logged into the system.

**Post-conditions:**
- The user's profile is updated with their preferred genres and moods.

**Actors:**
- Listener

**Scenario:**
The listener accesses their profile page and updates their preferences. The system saves these preferences for personalised recommendations.

## 1.10 View Artist Analytics
**Service Contract Name:** Artist views analytics on their music's performance.

**Pre-conditions:**
- The user must be logged into the system and have an artist profile.

**Post-conditions:**
- Detailed analytics about listeners who enjoy the artist's music are displayed.

**Actors:**
- Artist

**Scenario:**
The artist accesses the analytics page and views detailed insights about their listeners' preferences and behaviours.



<br />
<br />

# Use Case Diagrams

## 1. User Management Subsystem
![user-management](<User Management.png>)

## 2. Profile Management Subsystem
![profile-management](<Profile Management.png>)

## 3. Analytics Display Subsystem
![analytics](<Analytics Display.png>)

## 4. AI Processing Subsystem
![AI-processing](<new AI Subsystem.png>)

<br />
<br />

# UML Class Diagram
![class diagram](<class diagram.drawio.png>)

<br />
<br />

# Design Patterns

## Observer
- **Components:** NestJS Component (Subject), Profile Logic, Event Logic, Music Analysis Engine (Observers)
- This pattern is useful for event-driven architecture. When the 'NestJSComponent' handles events (such as user actions, music analysis completion), it can notify various subsystems that may need to update or react to these changes. 

## Singleton
- **Components:** Spotify Source Connector, Data Access
- Singleton ensures that a single instance of the Spotify API connector is used throughout the application to manage API rate limits and maintain a consistent state. The 'DataAccess' component should also be a singleton to ensure that database connections are efficiently reused and managed. 

## Adapter
- **Components:** Spotify Source Connector
- Implement an adapter for the Spotify API to make it compatible with our system's interface. This will ensure that the rest of the system interacts with the Spotify API in a consistent manner, no matter what changes are made to the API. 

<br />
<br />
