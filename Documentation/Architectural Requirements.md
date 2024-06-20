# Architectural Requirements Document

## Introduction
This document provides a detailed architecture specification for the ECHO Progressive Web App (PWA). The architecture is designed to ensure scalability, maintainability, and high performance while meeting the quality requirements of usability, reliability, and security.

## Architectural Design Strategy

### Choice of Strategy
We have chosen the decomposition strategy for our architectural design. This strategy allows us to break down the system into smaller, manageable components, each with specific responsibilities. This approach facilitates parallel development, easier maintenance, and scalability. Additionally, decomposition aligns well with our use of modular frameworks like Angular and Nest.js.

### Justification
- **Maintainability:** Smaller components are easier to manage, debug, and update.
- **Scalability:** Independent components can be scaled individually based on load and performance requirements.
- **Parallel Development:** Teams can work on different components simultaneously without causing conflicts.
- **Flexibility:** Changes in one component have minimal impact on others, allowing for easier implementation of new features.

## Architectural Strategies

### Layered Architecture
The system is designed using a combination of Layered Architecture, Model-View-Controller (MVC), and Service-Oriented Architecture (SOA). The architecture is divided into the following layers:
- Presentation Layer
- API Layer
- Business Layer
- Data Layer

Each layer has specific responsibilities and interacts with other layers through well-defined interfaces.

#### Justification for Layered Architecture
- **Separation of Concerns:** Each layer has a specific responsibility, making the system easier to understand and manage.
- **Reusability:** Components within a layer can be reused across different parts of the application.
- **Maintainability:** Changes in one layer do not affect other layers, reducing the risk of introducing bugs.
- **Layered Security and Access Control:** Security measures can be implemented at multiple layers, and different layers can enforce access controls, ensuring that only authorised users can access certain parts of the application. 

### Model-View-Controller (MVC)
The MVC pattern divides the application into three main components:
- **Model:** Manages the data and business logic.
- **View:** Handles the display and user interface.
- **Controller:** Processes the user input and itneracts with the Model and View

#### Justification for MVC
- **Separation of Concerns:** MVC separates the application into distinct components, making it easier to develop, test and maintain.
- **Reusability:** Views and Models can be reused across different parts of the application.
- **Ease of Testing:** Individual components can be tested independently, improving voerall testability.
- **Encapsulation:** Sensitive business logic is encapsulated within the Mode, protecting it from direct user interaction. 

### Service-Oriented Architecture (SOA)
SOA structures the application as a collection of services that communicate over a network. Each service performs a specific business function and can be reused across different applications. 

#### Justification for SOA
- **Reusability:** Services can be reused in multiple applications, reducing duplication and effort.
- **Scalability:** Services can be scaled independently to handle varying loads.
- **Interoperability:** Standardised communication protocols allow services to interact across different platforms and technologies. 
- **Service Contracts:** Security can be managed at the service level, enabling centralised control over authentication, authorisation and encryption.
- **Fault Isolation:** Failures in one service do not necessarily impact other services, enhancing overall reliability of the system.


## Quality Requirements

### Usability
1. **Intuitive Interface:** The application should be intuitive and easy to navigate, clear and organized without any unnecessary clutter. Design choices should be consistent throughout the interface, and clear visual cues (such as icons, buttons, and labels) should guide users through the interface logically and intuitively.
2. **User-Friendly:** The application should be responsive, personalisable, and easy to learn. Users should be able to customize their interface and receive clear, real-time feedback (loading indicators, confirmation, and error messages) from the system to understand the application's state and any actions they need to take.

### Performance
1. **Load Time and Responsiveness:** The application should load requested pages quickly, and the system should respond promptly when the user interacts with anything on a page.
2. **Scalability:** The system should be able to support large amounts of user traffic without significant latency.

### Reliability
1. **Error Handling:** The system should be able to identify errors and handle them quickly and gracefully, and provide meaningful feedback to users.
2. **Data Accuracy:** Data validation rules should be implemented to ensure user input is consistent and error-free, and that incorrect data is not entered into the system.

### Security
1. **Data Protection:** All user data should be encrypted both in transit and at rest, ensuring sensitive information is never exposed within the system.
2. **Authentication:** Secure methods should be used for user authentication, including multi-factor authentication.
3. **Authorization:** Ensure role-based access control to protect sensitive app features.

### Accessibility
1. **Inclusive Design:** The application should be designed to be accessible to users with disabilities, adhering to WCAG (Web Content Accessibility Guidelines).
2. **Assistive Technologies:** Support for screen readers, keyboard navigation, and other assistive technologies should be implemented to ensure all users can effectively use the application.

## Architectural Overview

### Presentation Layer
#### Components
- **Angular:** Provides an interactive and user-friendly interface.
#### Responsibilities
- Render the user interface and handle user interactions.
- Communicate with the REST API for data and service requests.
- Ensure a responsive and accessible UI.
#### Quality Contributions
- **Usability:** Separation allows for focused UI development.
- **Security:** Basic security measures like input validation are implemented in this layer.

### API Layer
#### Components
- **Node.js REST API:** Serves as an intermediary between the front end and the backend business logic.
#### Responsibilities
- Expose endpoints for the Angular Web App to interact with backend services.
- Handle HTTP requests and responses.
#### Quality Contributions
- **Performance:** Efficient handling of client requests ensures quick responses.
- **Security:** Implements authentication and authorization mechanisms.

### Business Layer
#### Components
1. **Application Logic (Nest.js Component)**
   - **Profile Logic:** Manages user profile data and preferences.
   - **Event Logic:** Handles user interactions and activities within the app.
   - **Spotify Source Connector:** Integrates with the Spotify API to fetch music data.
   - **API:** Interfaces with the Music Analysis Engine.
2. **Music Analysis Engine**
   - **Music Analysis Engine API:** Provides music analysis and recommendation services.
#### Responsibilities
- Implement the core business logic.
- Integrate with external services like the Spotify API.
- Provide music analysis and recommendation through AI algorithms.
#### Quality Contributions
- **Reliability:** Modular design allows for independent development and testing.
- **Performance:** Optimized business logic and efficient external API integration.
- **Security:** Implements data validation and secure data handling.

### Data Layer
#### Components
- **Data Access:** Responsible for querying and managing data stored in the database.
- **Database:** A NoSQL MongoDB database to store user data, music metadata, and other application data.
#### Responsibilities
- Handle all data-related operations.
- Provide data persistence and retrieval functionalities.
#### Quality Contributions
- **Performance:** Efficient data access and query mechanisms.
- **Reliability:** Ensures data integrity and availability.
- **Security:** Implements data encryption and access control.

## Architectural Constraints

### Technical Constraints
- **Latency:** The system should respond to user requests quickly for a seamless user experience.
- **Scalability:** The architecture must handle a large number of simultaneous users, scaling efficiently.
- **Frontend:** The application must be developed as a PWA.
- **Backend:** Use non-blocking and event-driven architecture for efficient I/O operations.
- **AI and ML Algorithms:** Implemented in Python.
- **Cloud Services:** Deployed and managed by a dedicated cloud service for data storage and processing.
- **Data Privacy:** Compliance with data protection regulations (GDPR, CCPA).
- **Third-Party APIs:** Integrate with music APIs for accessing music metadata and streaming capabilities.
- **Internal APIs:** Develop RESTful APIs for internal communication between the frontend and backend services.

### Operational Constraints
- **CI/CD:** Implement CI/CD pipelines to automate testing, integration, and deployment processes.
- **Downtime:** Minimize downtime during deployments and maintenance.
- **Authentication:** Use OAuth for secure user authentication and authorization.
- **Security Audits:** Regularly conduct security audits and penetration tests.
- **Resource Management:** Monitor and manage cloud resource usage.
- **Cross-Platform:** Ensure the application is functional on various devices and operating systems.
- **Offline Access:** Implement service workers for offline capabilities.
- **Content Moderation:** Implement mechanisms to moderate user-generated content.

## Technology Choices

### Programming Languages
- **Frontend:** TypeScript, HTML (Angular Template Syntax).
- **Backend:** JavaScript, TypeScript, Python.

### Frameworks and Libraries
- **Frontend:** Angular, Angular PWA, Tailwind CSS, Flowbite.
- **Backend:** Node.js, Express.js, Nest.js, Mongoose.
- **Package Management:** npm, pip.

### Database Management System
- **Primary:** MongoDB.
- **Cloud-Based:** Azure Cosmos DB with MongoDB API.

### Development Tools
- **IDEs and Editors:** Visual Studio Code, WebStorm, PyCharm.
- **Version Control:** Git, GitHub.
- **API Development:** Postman.

### Technology Evaluation
For each component of our system, we considered multiple technologies and selected the most suitable ones based on their compatibility with our architectural strategies, performance, scalability, and ease of integration.

## Conclusion
By adhering to these architectural requirements and strategies, we aim to create a robust, scalable, and maintainable Progressive Web Application that meets our quality requirements and provides a seamless user experience. Regular reviews and updates to this document will ensure that our architecture remains aligned with evolving project needs and technological advancements.