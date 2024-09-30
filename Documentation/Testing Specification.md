# ECHO Testing Policy
<br />

## Technologies
We are using Jest for both our Backend and Frontend testing, in conjunction with Angular and Nest.js Testing module libraries. Since the testing paradigmes are already quite in both divisions, we decided to use Jest to make testing more uniform across both parts of our project. We use github actions as our automated testing platform for it's ease of use, setup and implementaion.

## Procedure
Tests are written per file, and written when the new files are first introduced into the development branch. Changes are pulled into the stablization branch, where working tests are all written for new methods, or stubbed for future implementation. Once the version of the application in Stablization is tested and stable, the changes are pulled into dev.

The above cycle is continued until development is stable. 

All tests are automated in the Stablization, Development and Main branches.

