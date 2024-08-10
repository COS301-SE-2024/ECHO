# Echo Music Recommendation App - Installation Manual

## Table of Contents
- [Echo Music Recommendation App - Installation Manual](#echo-music-recommendation-app---installation-manual)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Common Issues](#common-issues)
    - [Issue: Cannot find module '@angular/core'](#issue-cannot-find-module-angularcore)
    - [Issue: Spotify API Authentication Errors](#issue-spotify-api-authentication-errors)
  - [Contribution Guidelines](#contribution-guidelines)

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** and **npm**: Make sure you have Node.js and npm installed. You can download them from [Node.js official website](https://nodejs.org/).
- **Angular CLI**: Install Angular CLI globally if you haven't already:
  ```bash
  npm install -g @angular/cli

## Installation Steps
### Clone the Repository
First, clone the repository from GitHub to your local machine:

```
git clone https://github.com/your-username/echo-music-recommendation-app.git
cd echo-music-recommendation-app
```

### Install Dependencies
Navigate to the project directory and install the necessary dependencies:

```
npm install
```
### Set Up Environment Variables
Create a .env file in the root directory of the project and add the following environment variables:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:4200/callback
```

Replace your_spotify_client_id, your_spotify_client_secret, and your_spotify_redirect_uri with your actual Spotify API credentials.

### Run the Application
To run the application locally, use the Angular CLI:
```
ng serve
```
Open your browser and navigate to http://localhost:4200/.

## Directory Structure
Here's a brief overview of the project's directory structure:

```
echo-music-recommendation-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── info-bar/
│   │   │   ├── artist-profile/
│   │   │   ├── side-bar/
│   │   │   ├── song-view/
│   │   │   └── moods/
│   │   ├── services/
│   │   ├── models/
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   └── index.html
├── .env
├── angular.json
├── package.json
└── README.md
```

## Common Issues
### Issue: Cannot find module '@angular/core'
Solution: Ensure that all dependencies are installed correctly. Run npm install again to make sure.

### Issue: Spotify API Authentication Errors
Solution: Double-check your Spotify API credentials in the .env file and ensure they are correct. Make sure the redirect URI matches what is configured in your Spotify developer dashboard.

## Contribution Guidelines
We welcome contributions! Follow these steps to contribute to the project:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature-name).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature/your-feature-name).
6. Open a pull request.