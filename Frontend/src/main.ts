import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ProviderService } from './app/services/provider.service';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

const providerConfig: ApplicationConfig = {
  providers: [ProviderService]
};

const mergedConfig = mergeApplicationConfig(appConfig, providerConfig);

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
  
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ngsw-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
