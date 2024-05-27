# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Progressive Web App (PWA)

This project is configured as a Progressive Web App (PWA). PWAs provide a number of advantages, such as the ability to work offline, run background tasks, and be installed on the user's device.

To add PWA capabilities to your Angular project, run `ng add @angular/pwa`. This command will create a `manifest.json` file, add a service worker, and make other necessary configurations.

Remember, service workers and PWAs only work over HTTPS or on `localhost` for development, so you'll need to deploy your app to a server with HTTPS to see the PWA features in a production environment.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Routing in Angular
In Angular, `routing` is the process of transitioning from one view to another as users perform application tasks. The `<router-outlet></router-outlet>` in `App.-.html` directive is a placeholder that Angular dynamically fills based on the current router state.

Here's how you can set up routing in your Angular application:

Create Components: First, create the components that you want to navigate to. You can create a component using the `ng generate component component-nam`e command.

`Configure Routes`: Next, configure your routes in a Routes object. This object should map paths to your components. For example:
Import RouterModule: Import the RouterModule in your app.module.ts (or equivalent) and call RouterModule.forRoot(routes) in your imports array.
Router Outlet: Include a <router-outlet></router-outlet> directive in your app.component.html file. This is where the content of the active route will be displayed.

`Navigation`: Use the `<a routerLink="/path" > `directive to create links that users can click to navigate to different routes,
for example  `{ path: 'landing', component: LandingPageComponent }`

Remember to replace `LandingPageComponent`, `landing` with your actual component names and paths.