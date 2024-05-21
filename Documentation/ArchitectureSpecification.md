# Architecture Specification

## Introduction
This document provides a detailed architecture specification for the ECHO Progressive Web App (PWA). The architecture is designed to ensure scalability, maintainability and high performance while meeting the quality requirements of usability, reliability and security. 

## Architectural Overview
The system is designed using a combination of Layered Architecture, Model-View-Controller (MVC) and Service-Oriented Architecture (SOA). The architecture is divided into the following layers:
- Presentation Layer
- API Layer
- Business Layer
- Data Layer
Each later has specific responsibilities and interacts with other layers through well-defined interfaces.

## Presentation Layer

### Components
The front end of the application is developed using Angular. It provides an interactive and user-friendly interface. 

### Responsibilities
- Render the user interface and handle user interactions.
- Communicate with the REST API for data and service requests.
- Ensures a responsive and accessible UI.

### Quality Contributions
- **Usability:** The separation for the presentation layer allows for focused UI development, ensuring a consistent and user-friendly experience.
- **Security:** Basic security measures like input validation are implemented in this layer. 

## API Layer

### Components
A Node.js REST API serves as an intermediary between the front end and the backend business logic. It handles client requests and routes them to the appropriate services.

### Responsibilities
- Expose endpoints for the Angular Web App to interact with backend services.
- Handle HTTP requests and responses.

### Quality Contributions
- **Performance:** Efficient handling of client requests ensures quick responses and high performance.
- **Security:** Implements authentication and authorisation mechanisms to secure API endpoints.

## Business Layer

### Components

#### Application Logic (Nest.js Component)
- **Profile Logic:** Manages user profile data and preferences.
- **Event Logic:** Handles events such as user interactions and activities within the app.
- **Spotify Source Connector:** Integrates with the Spotiofy API to fetch music data.
- **API:** Interfaces with the Music Analysis Engine.

#### Music Analysis Engine
- **Music Analysis Engine API:** Provides music analysis and recommendation services.

### Responsibilities
- Implement the core business logic of the application.
- Integrate with external services like the Spotify API.
- Provide music analysis and recommendation through AI algorithms

### Quality Contributions
- **Reliability:** The modular design allows for independent development and testing of business logic components.
- **Performance:** Optimised business logic and efficient external API integration ensure high performance.
- **Security:** Implements business-specific security measures, such as data validation and secure data handling.

## Data Layer

### Components
- **Data Access:** Responsible for querying and managing data stored in the database.
- **Database:** A NoSQL MongoDB database to store user data, music metadata and other application data.

### Responsibilities
- Handle all data-related operations.
- Provide data persistence and retriebal functionalities.

### Quality Contributions
- **Performance:** Efficient data access and query mechanisms ensure quick data retrieval. 
- **Reliability:** Ensures data integrity adandn availability through robust data management practices.
- **Security:** Implements data encryption and access control mechanisms to protect stored data.