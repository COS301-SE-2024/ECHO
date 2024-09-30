# ECHO Testing Policy
<br />

## Technologies
We are using Jest for both our Backend and Frontend testing, in conjunction with Angular and Nest.js Testing module libraries. Since the testing paradigmes are already quite in both divisions, we decided to use Jest to make testing more uniform across both parts of our project. We use github actions as our automated testing platform for it's ease of use, setup and implementaion.

## Procedure
Tests are written per file, and written when the new files are first introduced into the development branch. Changes are pulled into the stablization branch, where working tests are all written for new methods, or stubbed for future implementation. Once the version of the application in Stablization is tested and stable, the changes are pulled into dev.

The above cycle is continued until development is stable. 

All tests are automated in the Stablization, Development and Main branches.

## Test Cases
### User Registration
#### Expected outcome
- Allow users to register on the application securely.
#### Test Conditons
- Registration must accept if and only if access tokens are valid.
### User Login
#### Expected outcome
- Allow users to log into the application securely using their created credentials.
#### Test Conditions
- Login proceeds if and only if access and provider tokens are valid
### Link Spotify account
#### Expected outcome
- Allow users to log into their Spotify account to link it to the application.
#### Test Conditions
- Spotify Login accepts if Spotify Premium Account is valid.
### Link Google account
#### Expected outcome
- Allow users to log into their Google account to link it to the application.
#### Test Conditions
- Google accepts valid google account login attempts
### Song-Specific Recommendations
#### Expected outcome
- Provide recommendations based on analysis of the song the user is currently listening to.
#### Test Conditions
- Echo method returns Recomendations
### Visual Insights
#### Expected outcome
- Users must be able to view intuitive graphs and charts showing common themes and moods in their listening history.
#### Test Conditions
- Charts render on insights page
### Mood-Reflective UI
#### Expected outcome
- The UI must dynamically adjust to reflect the user's mood based on the current song.
#### Test Conditions
- Mood changes when a new song plays if the new mood is different from the existing mood.
### UI Toggle
#### Expected outcome
- Users must have the ability to toggle the dynamic UI feature on and off.
#### Test Conditions
- Mood theme must stay the same if it has been selected in the settings page
### Minimise/Maximise Suggestions
#### Expected outcome
- Allow users to minimise or maximise the Suggestions and Recent Listening block.
#### Test Conditions
- Suggestions tab minimizes when button is pressed.
### Cross-Platform Compatibility
#### Expected outcome
- The application must be compatible with various devices and operating systems, including desktops, tablets, and smartphones.
#### Test Conditions
- App dynamically changes to Mobile or Desktop layout.
### Offline Functionality
#### Expected outcome
- Offline functionality must be implemented to allow users to access the app without an internet connection and view their previous recommendations.
#### Test Conditions
- Local storage is populated when switching to offline mode.
### Performance Optimization
#### Expected outcome
- Application performance should be optimized to provide a smooth and responsive user experience.
#### Test Conditions
- All tests must complete in under 3 seconds.
### Search Music
#### Expected outcome
- Allow users to search for new music.
#### Test Conditions
- Search methods return results from Deezer API.
### Mood Discovery/Browsing
#### Expected outcome
- Allow users to browse through different mood categories to find music that matches their mood manually.
#### Test Conditions
- Songs load that match the mood when a Mood category is browsed.
### Filter mood recommendations
#### Expected outcome
- Allow users to filter their recommendations by mood on the Home page.
#### Test Conditions
- Filters load songs from your queue that match the mood.
### Play Music
#### Expected outcome
- Enable users to play music directly from the application.
#### Test Conditions
- Play button works when pressed.
### Adjust volume 
#### Expected outcome
- Enable users to increase and decrease the volume of the song they are listening to.
#### Test Conditions
- Volume slider translates position to new volume.
### Skip song
#### Expected outcome
- Allow users to skip the current song and play the next.
#### Test Conditions
- Skip button loads next song in queue.
### Rewind song
#### Expected outcome
- Allow users to rewind the current song to any point in the song they wish.
#### Test Conditions
- Song timeline translates position to reletive point in song playback.
### View recently listened
#### Expected outcome
- Allow users to view a list of songs in order of most recently listened.
#### Test conditions
- Queue loads on initilization.
### View artist's profile
#### Expected outcome
- Allow users to view and play all the works of a single artist on one page.
#### Test Conditions
- Songs load from Deezer API based on Artist.
### Mobile Separation of concerns
#### Expected outcome
- Ensure that the mobile application has a clear separation of concerns to improve maintainability and scalability.
#### Test Conditions
- UI Switches to different components dynamically when user changes device

## Exit Criteria
- Test Coverage is above 80%
- All tests are passing.