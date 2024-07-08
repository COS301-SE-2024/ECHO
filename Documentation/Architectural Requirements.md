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
- **Interoperability:** Standardised communication protocols allow services to interact across different platforms and technologies. 


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

## Architectural Overview

![architecture diagram](<architecture.png>)

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
- **Frontend:** 
  - **TypeScript**
    - **Pros:**
      - Static typing helps catch errors at compile time.
      - Enhanced IDE support and autocompletion.
      - Supports modern JavaScript features and can be transpiled to older versions.
      - Large and active community.
    - **Cons:**
      - Requires a compilation step.
      - Steeper learning curve for beginners compared to plain JavaScript.
      - Can be overkill for small projects.

  - **HTML (Angular Template Syntax)**
    - **Pros:**
      - Declarative syntax makes it easy to understand the structure of the application.
      - Integrates seamlessly with Angular, enabling powerful data binding and directives.
      - Supports Angular’s reactive programming model.
    - **Cons:**
      - Limited in terms of logic handling; complex logic should be moved to components.
      - Requires understanding of Angular-specific attributes and syntax.

- **Backend:** 
  - **JavaScript**
    - **Pros:**
      - Ubiquitous language, used both on the client and server sides.
      - Large ecosystem of libraries and frameworks.
      - Event-driven, non-blocking I/O model suitable for real-time applications.
    - **Cons:**
      - Dynamic typing can lead to runtime errors.
      - Callbacks can lead to complex, hard-to-maintain code (callback hell).
      - Less performant for CPU-intensive operations.

  - **TypeScript**
    - **Pros:**
      - All the advantages of JavaScript with added type safety.
      - Better tooling and refactoring support.
      - Easier to maintain and scale large codebases.
    - **Cons:**
      - Same cons as JavaScript with the addition of a necessary compilation step.
      - Learning curve for developers not familiar with strongly typed languages.

  - **Python**
    - **Pros:**
      - Simple and readable syntax.
      - Extensive standard library and large ecosystem of third-party packages.
      - Great for quick prototyping and scripting.
      - Strong support for data science and machine learning applications.
    - **Cons:**
      - Interpreted language, generally slower than compiled languages.
      - Not as suited for mobile and web client-side development.
      - Global Interpreter Lock (GIL) can be a bottleneck for multi-threaded applications.

### Frameworks and Libraries
- **Frontend:** 
  - **Angular**
    - **Pros:**
      - Robust framework with a comprehensive set of tools and features.
      - Two-way data binding simplifies UI updates.
      - Strong support for building large-scale enterprise applications.
      - Powerful CLI for scaffolding and managing projects.
    - **Cons:**
      - Steep learning curve.
      - Verbose and complex configuration.
      - Can be overkill for small projects.

  - **Angular PWA**
    - **Pros:**
      - Enhances user experience with offline capabilities.
      - Uses service workers for better performance and reliability.
      - Easy to convert an existing Angular application into a PWA.
    - **Cons:**
      - Adds complexity to the application.
      - Requires careful handling of caching and updates.
      - Browser support for PWA features varies.

  - **Tailwind CSS**
    - **Pros:**
      - Utility-first approach allows for rapid styling without writing custom CSS.
      - Highly customizable with configuration files.
      - Helps in maintaining consistency across the application.
    - **Cons:**
      - Can result in verbose HTML with many utility classes.
      - Initial learning curve for those used to traditional CSS/SASS approaches.
      - Purging unused styles is necessary to keep file sizes small.

  - **Flowbite**
    - **Pros:**
      - Provides a set of pre-designed UI components that work with Tailwind CSS.
      - Speeds up development by reducing the need to design common components from scratch.
      - Maintains consistency with Tailwind's utility-first approach.
    - **Cons:**
      - Limited customization compared to building components from scratch.
      - Dependent on the styling and structure provided by Flowbite.
      - May not cover all use cases and components required for a project.

- **Backend:** 
  - **Node.js**
    - **Pros:**
      - Asynchronous, non-blocking I/O model suitable for real-time applications.
      - Unified language across frontend and backend (JavaScript).
      - Large ecosystem with npm.
    - **Cons:**
      - Single-threaded, which can be a limitation for CPU-bound tasks.
      - Callbacks and async code can become complex.
      - Less mature compared to some other backend languages.

  - **Express.js**
    - **Pros:**
      - Minimal and flexible framework for Node.js.
      - Middleware system makes it extensible.
      - Large community and a plethora of plugins.
    - **Cons:**
      - Requires additional setup for more complex applications.
      - Limited built-in features compared to more comprehensive frameworks.
      - Callback-heavy, which can affect readability and maintainability.

  - **Nest.js**
    - **Pros:**
      - Built with TypeScript, providing type safety.
      - Uses a modular architecture that is easy to maintain and scale.
      - Built-in support for microservices and GraphQL.
    - **Cons:**
      - Steeper learning curve due to its comprehensive feature set.
      - More complex setup compared to simpler frameworks like Express.js.
      - Can be overkill for small projects.

  - **Mongoose**
    - **Pros:**
      - Elegant MongoDB object modeling for Node.js.
      - Provides schema validation and middleware.
      - Supports built-in type casting and query building.
    - **Cons:**
      - Adds an abstraction layer over MongoDB, which can introduce complexity.
      - Can be less performant for very high-volume operations.
      - Learning curve for those new to ODMs.

- **Package Management:** 
  - **npm**
    - **Pros:**
      - Largest package registry for JavaScript.
      - Integrated with the Node.js ecosystem.
      - Easy to publish and manage packages.
    - **Cons:**
      - Security concerns due to the vast number of packages.
      - Dependency management can become complex.
      - Performance issues with older versions.

  - **pip**
    - **Pros:**
      - Standard package manager for Python.
      - Wide range of packages available on PyPI.
      - Easy to use and integrate with virtual environments.
    - **Cons:**
      - Dependency resolution can be problematic.
      - Some packages may have platform-specific issues.
      - Security concerns with unvetted packages.

### Database Management System
- **Primary:** MongoDB.
  - **Pros:**
    - Schema-less, allowing for flexible and scalable data models.
    - High performance for read and write operations.
    - Horizontal scaling with built-in sharding.
    - Strong community and extensive documentation.
  - **Cons:**
    - Lacks ACID transactions for complex operations (though improvements have been made).
    - Less mature tooling compared to relational databases.
    - Learning curve for those accustomed to SQL databases.

- **Cloud-Based:** Azure Cosmos DB with MongoDB API.
  - **Pros:**
    - Globally distributed, providing low latency and high availability.
    - Supports multiple APIs, including MongoDB.
    - Scalable throughput and storage.
    - Managed service, reducing operational overhead.
  - **Cons:**
    - Higher cost compared to self-managed MongoDB instances.
    - Potential for vendor lock-in.
    - Complex pricing model.

### Development Tools
- **IDEs and Editors:** 
  - **Visual Studio Code**
    - **Pros:**
      - Lightweight and fast.
      - Extensive plugin ecosystem.
      - Excellent support for debugging and Git integration.
      - Free and open-source.
    - **Cons:**
      - Can become sluggish with many plugins.
      - Less powerful refactoring tools compared to some commercial IDEs.
      - Configuration and customization can be time-consuming.

  - **WebStorm**
    - **Pros:**
      - Comprehensive support for JavaScript and TypeScript.
      - Powerful refactoring and navigation features.
      - Integrated tools for debugging, testing, and version control.
    - **Cons:**
      - Commercial product, requires a license.
      - Can be resource-intensive.
      - Slower startup compared to lighter editors.

  - **PyCharm**
    - **Pros:**
      - Excellent support for Python development.
      - Powerful debugging and testing tools.
      - Built-in support for web development frameworks.
    - **Cons:**
      - Commercial product, though a free community edition is available.
      - Can be resource-intensive.
      - Slower startup compared to lightweight editors.

- **Version Control:** 
  - **Git**
    - **Pros:**
      - Distributed version control system, enabling offline work.
      - Powerful branching and merging capabilities.
      - Widely adopted and supported.
    - **Cons:**
      - Steep learning curve for beginners.
      - Complexity in managing large repositories.
      - Can be confusing due to its many commands and options.

  - **GitHub**
    - **Pros:**
      - Comprehensive platform for hosting and managing Git repositories.
      - Integrated tools for issue tracking, CI/CD, and project management.
      - Strong community and social coding features.
    - **Cons:**
      - Limited private repositories for free accounts (though improved recently).
      - Dependency on GitHub’s ecosystem.
      - Can be overkill for small projects.

- **API Development:** Postman
  - **Pros:**
    - User-friendly interface for testing APIs.
    - Supports automated testing and CI/CD integration.
    - Extensive features for collaboration and documentation.
    - Free tier available with sufficient features for most needs.
  - **Cons:**
    - Can be resource-intensive for large collections.
    - Advanced features require a paid subscription.
    - Learning curve for mastering all features.

### Technology Evaluation
For each component of our system, we considered multiple technologies and selected the most suitable ones based on their compatibility with our architectural strategies, performance, scalability, and ease of integration.

## Conclusion
By adhering to these architectural requirements and strategies, we aim to create a robust, scalable, and maintainable Progressive Web Application that meets our quality requirements and provides a seamless user experience. Regular reviews and updates to this document will ensure that our architecture remains aligned with evolving project needs and technological advancements.
