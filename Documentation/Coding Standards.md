# Coding Standards Document

## Table of Contents
- [Coding Standards Document](#coding-standards-document)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [General Guidelines](#general-guidelines)
  - [Naming Conventions](#naming-conventions)
  - [Formatting](#formatting)
    - [Example:](#example)
  - [Comments](#comments)
    - [Example:](#example-1)
  - [File Structure](#file-structure)
    - [Example Structure:](#example-structure)
  - [Tools and Configurations](#tools-and-configurations)
    - [ESLint Configuration (example .eslintrc.json):](#eslint-configuration-example-eslintrcjson)
    - [Prettier Configuration (example .prettierrc):](#prettier-configuration-example-prettierrc)
  - [Best Practices](#best-practices)

## Introduction
This document outlines the coding standards for our Angular Progressive Web Application (PWA) project to ensure a uniform style, clarity, flexibility, reliability, and efficiency. Adherence to these standards will facilitate collaboration and maintain code quality across the team.

## General Guidelines
- Write clean, readable, and maintainable code.
- Follow the Single Responsibility Principle: each component, service, and method should have one responsibility.
- Avoid code duplication; use reusable components and services.
- Ensure code is properly tested with unit and integration tests.
- Handle exceptions gracefully and provide meaningful error messages.

## Naming Conventions
- **Components:** Use PascalCase with a descriptive suffix (e.g., `UserProfileComponent`, `NavBarComponent`).
- **Services:** Use PascalCase with a descriptive suffix (e.g., `AuthService`, `UserService`).
- **Modules:** Use PascalCase with a descriptive suffix (e.g., `AppModule`, `UserModule`).
- **Directives and Pipes:** Use camelCase with a descriptive suffix (e.g., `highlightDirective`, `datePipe`).
- **Variables and Methods:** Use camelCase (e.g., `userName`, `getUserDetails`).
- **Constants:** Use UPPERCASE with underscores (e.g., `MAX_RETRIES`).
- **Files and Directories:** Use kebab-case (e.g., `user-profile.component.ts`, `auth.service.ts`).

## Formatting
- **Indentation:** Use 2 spaces per indentation level.
- **Line Length:** Limit lines to 100 characters.
- **Braces:** 
  - Open brace `{` should be at the end of the same line as the statement (K&R style).
  - Closing brace `}` should be on a new line aligned with the opening statement.
- **Spaces:** 
  - Place a space after keywords (e.g., `if`, `for`, `while`).
  - No space between method names and parentheses (e.g., `myMethod()`).

### Example:
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  private exampleField: number;

  constructor() {
    this.exampleField = 0;
  }

  exampleMethod(): void {
    if (this.exampleField > 0) {
      console.log('Positive value');
    }
  }
}
```

## Comments
- **Component and Service Comments:** At the top of each component and service, describe its purpose and any important details.
- **Method Comments:** Before each method, describe what the method does, its parameters, and its return value.
- **Inline Comments:** Use sparingly, only to explain complex or non-obvious code segments.

### Example:
```typescript
/**
 * Represents the example component.
 */
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  private exampleField: number;

  /**
   * Initializes a new example component.
   */
  constructor() {
    this.exampleField = 0;
  }

  /**
   * Example method that logs a message based on the field value.
   */
  exampleMethod(): void {
    if (this.exampleField > 0) {
      console.log('Positive value');
    }
  }
}
```

## File Structure
- **src/**: Contains all source code files.
  - **app/**: Contains the main application code.
    - **pages/**: Contains all pages of the application.
    - **shared/**: Contains all shared components of the application.
  - **assets/**: Contains static assets like images and styles.
  - **styles/**: Contains CSS styling files.

### Example Structure:
```
repository/
│
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── landing-page/
│   │   │   │   ├── landing-page.component.ts
│   │   │   │   ├── landing-page.component.html
│   │   │   │   └── landing-page.component.css
│   │   ├── shared/
|   |   |   |   |nav-bar/
│   │   │   │   ├── nav-bar.component.ts
│   │   │   │   ├── nav-bar.component.html
│   │   │   │   └── nav-bar.component.css
│   ├── assets/
│   │   ├── images/
│   ├── styles/
│       ├── styles.css
├── angular.json
├── package.json
└── README.md
```

## Tools and Configurations
- **IDE:** Use Visual Studio Code or WebStorm.
- **Linter:** Use ESLint with the following configuration:
  - Indentation: 2 spaces
  - Max line length: 100 characters
  - Naming conventions as per the above guidelines
- **Formatter:** Use Prettier with the following configuration:
  - Single Quote: `true`
  - Trailing Comma: `all`
  - Tab Width: `2`

### ESLint Configuration (example .eslintrc.json):
```json
{
  "extends": ["eslint:recommended", "plugin:@angular-eslint/recommended"],
  "rules": {
    "indent": ["error", 2],
    "max-len": ["error", { "code": 100 }],
    "quotes": ["error", "single"]
  }
}
```

### Prettier Configuration (example .prettierrc):
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2
}
```

## Best Practices
- **Version Control:** Commit small, logical changes with clear commit messages.
- **Code Reviews:** Conduct regular code reviews to ensure adherence to standards.
- **Testing:** Write unit and integration tests. Aim for high code coverage.
- **Documentation:** Keep the documentation up-to-date with code changes.

By following these standards, we aim to create a codebase that is easy to read, maintain, and extend. These guidelines should be reviewed and updated regularly to adapt to new requirements and best practices.