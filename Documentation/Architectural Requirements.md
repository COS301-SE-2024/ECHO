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
- **interoperability:** Each layer can be designed to interact with external systems and services, facilitating seamless integration and data exchange. 

### Model-View-Controller (MVC)
The MVC pattern divides the application into three main components:
- **Model:** Manages the data and business logic.
- **View:** Handles the display and user interface.
- **Controller:** Processes the user input and interacts with the Model and View

#### Justification for MVC
- **Separation of Concerns:** MVC separates the application into distinct components, making it easier to develop, test and maintain.
- **Reusability:** Views and Models can be reused across different parts of the application.
- **Ease of Testing:** Individual components can be tested independently, improving overall testability.
- **Encapsulation:** Sensitive business logic is encapsulated within the Mode, protecting it from direct user interaction. 

### Service-Oriented Architecture (SOA)
SOA structures the application as a collection of services that communicate over a network. Each service performs a specific business function and can be reused across different applications. 

#### Justification for SOA
- **Reusability:** Services can be reused in multiple applications, reducing duplication and effort.
- **Scalability:** Services can be scaled independently to handle varying loads.
- **Interoperability:** Standardised communication protocols allow services to interact across different platforms and technologies. 
- **Service Contracts:** Security can be managed at the service level, enabling centralised control over authentication, authorisation and encryption.
- **Fault Isolation:** Failures in one service do not necessarily impact other services, enhancing overall reliability of the system.
- **Interoperability:** Standardised communication protocols allow services to interact across different platforms and technologies. 

### Microservices
Microservices structures applications as a collection of loosely coupled, independently deployable services within our AI system. Each service has a unique function and can be scaled individually as needed.

#### Justification for Microservices
- **Modularity:** Each module is independently developed and maintained, allowing them to work autonomously and be updated without affecting others.
- **Scalability:** Individual services can be scaled as needed without impacting the other services.
- **Fault Isolation:** If a failure occurs in one module, the entire system will not be affected and can continue running.
- **Performance Optimisation:** Services can be optimised independently based on their resource needs. 

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

### Interoperability
1. **Integration:** The system should be capable of integrating seamlessly with other systems and applications, allowing data exchange and interactions without compatibility issues. 
2. **Data Exchange:** The system should support common data formats to enable smooth data exchange between different systems and services. 

### Maintainability
1. **Separation of Concerns:** The system’s codebase is modular, adhering to a clear separation of concerns (e.g., using MVC). This ensures that different parts of the system can be modified independently without affecting unrelated components, making it easier to maintain and update. 
2. **System Independence:** Each module has minimal dependencies on others, allowing individual components to be updated, tested, or replaced without requiring extensive changes to the entire system. This reduces downtime and makes bug fixing or feature development more efficient.

### Accessibility
1. **PWA Functionality:** The application implements Progressive Web App (PWA) features to provide a native app-like experience, including offline access, fast loading, and the ability to be installed on user devices. This ensures the app remains accessible even when there is limited connectivity.
2. **Use of Different Providers:** The application provides compatibility with a range of music service providers, such as Spotify, YouTube and Deezer, to ensure users can access the system using any type of account.
3. **UI Customisation:** Users are able to customise the user interface to meet their needs, such as changing the theme/UI colour for better contrast or to adjust colour sensitivity, to provide an inclusive experience for users with colour sensitivity or colour blindness.
4. **Smooth UI Transiton:** The UI should offer smooth transitions between the different mood themes, easing the effect of the colour change on users with colour-sensitivity and epilepsy.

## Architectural Overview

![architecture diagram](<images/ECHO Architecture.png>)

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
- **Accessibiity:** UI customisation and smooth theme transitions to allow for inclusion of users with colour/light-related disabilities.
- **Maintainability:** The Angular framework along with the use of atomic design makes it easier to maintain and update individual elements of the UI without affecting the overall application.

### API Layer
#### Components
- **Node.js REST API:** Serves as an intermediary between the front end and the backend business logic.
#### Responsibilities
- Expose endpoints for the Angular Web App to interact with backend services.
- Handle HTTP requests and responses.
#### Quality Contributions
- **Performance:** Efficient handling of client requests ensures quick responses.
- **Security:** Implements authentication and authorisation mechanisms.
- **Interoperability:** The REST API is designed to handle requests from multiple types of clients, including different front-end applications and external systems, enabling seamless integration with third-party services.


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
- **Interoperability**: Integrates seamlessly with external services like Spotify, allowing for flexible connectivity and data exchange.
- **Scalability:** The ability to handle multiple API integrations (such as Spotify) while efficiently scaling the number of users and the complexity of music analysis tasks ensures that the business layer can grow to meet increased demand.

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
- **Maintainability:** The data layer uses standardised data access patterns, making updates or changes to database queries easier without impacting the rest of the application.

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
- **FRONTEND:** TypeScript, HTML (Angular Template Syntax).
  - **Justification:** TypeScript offers static typing, which improves code quality, maintainability, and helps catch errors during development, making the frontend more robust and scalable. Angular Template Syntax complements HTML, providing enhanced capabilities for dynamic views that integrate well with TypeScript, improving productivity and readability. Majority of our group members also have experience working with Angular before this project.
- **BACKEND:** JavaScript, TypeScript, Python.
  - **Justification:** JavaScript and TypeScript are natural choices for a Node.js environment, enabling full-stack JavaScript development for consistency across both frontend and backend. TypeScript provides type safety, improving reliability and reducing runtime errors. Python is included to handle specific computational tasks or leverage its powerful ecosystem for data manipulation and scripting, where Python's efficiency is particularly beneficial.

### Frameworks and Libraries
- **FRONTEND:** Angular, Angular PWA, Tailwind CSS, Flowbite.
  - **Justification:** Angular is a powerful framework that supports component-based architecture, facilitating maintainability and scalability. Angular PWA allows the app to function offline and behave like a native application, improving user experience. Tailwind CSS is a utility-first CSS framework that allows for rapid and consistent styling without writing custom CSS, enhancing productivity. Flowbite is used for ready-made UI components that are designed for Tailwind CSS, speeding up development with pre-built, accessible components.
- **BACKEND:** Node.js, Express.js, Nest.js, Mongoose.
  - **Justification:** Node.js is suitable for building scalable, fast server-side applications using JavaScript. Express.js provides a minimal and flexible framework to build RESTful APIs, while Nest.js provides a more structured, modular approach to building backend applications, using TypeScript natively for better type safety. Mongoose is an object data modeling (ODM) library for MongoDB, simplifying the interaction between the backend and the database through schema-based solutions.
- **PACKAGE MANAGEMENT:** npm, pip.
  - **Justification:** npm is the default package manager for JavaScript/TypeScript projects, supporting Node.js and Angular development, providing a robust ecosystem of tools and libraries. pip is essential for managing Python packages, ensuring that dependencies for any Python-based services are efficiently handled.

### Database Management System
- **PRIMARY:** MongoDB.
  - **Justification:** MongoDB is a NoSQL document database that offers flexibility and scalability, which is ideal for applications that handle large amounts of unstructured data or need to scale quickly. Its JSON-like documents fit seamlessly with JavaScript/TypeScript, reducing the mismatch between code and data.
- **CLOUD-BASED:** Azure Cosmos DB with MongoDB API.
  - **Justification:** Azure Cosmos DB provides a globally distributed, highly available cloud database service, ensuring data redundancy and low latency. The MongoDB API compatibility allows developers to work with familiar MongoDB tools and practices while leveraging the scalability and reliability of a managed cloud database.
  
### Development Tools
- **IDEs & EDITORS:** Visual Studio Code, WebStorm, PyCharm.
  - **Justification:** Visual Studio Code is a versatile, lightweight, and extensible code editor that is widely used for JavaScript/TypeScript development, offering great integration with Node.js. WebStorm provides a more feature-rich, IDE-level experience for JavaScript/TypeScript, increasing productivity for complex projects. PyCharm is specifically used for Python, offering specialised tools and support that enhance development efficiency, such as refactoring tools and built-in testing capabilities.
- **VERSION CONTROL:** Git, GitHub.
  - **Justification:** Git is the industry-standard version control system, providing powerful branching and merging capabilities, which are essential for collaboration and version management. GitHub is a cloud-based platform that enhances Git with additional collaboration features such as pull requests, issue tracking, and code reviews, supporting a smooth development workflow for team projects.
- **API DEVELOPMENT:** Postman.
  - **Justification:** Postman is a widely used tool for API testing and development, providing an intuitive interface for making HTTP requests, validating responses, and generating documentation. It simplifies the testing and debugging process of APIs, which is essential for ensuring the backend services work as expected.

### Technology Evaluation
For each component of our system, we considered multiple technologies and selected the most suitable ones based on their compatibility with our architectural strategies, performance, scalability, and ease of integration.

## Conclusion
By adhering to these architectural requirements and strategies, we aim to create a robust, scalable, and maintainable Progressive Web Application that meets our quality requirements and provides a seamless user experience. Regular reviews and updates to this document will ensure that our architecture remains aligned with evolving project needs and technological advancements.
