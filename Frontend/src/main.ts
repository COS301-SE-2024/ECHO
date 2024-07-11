import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ProviderService } from './app/services/provider.service';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

const providerConfig: ApplicationConfig = {
  providers: [ProviderService]
};

const mergedConfig = mergeApplicationConfig(appConfig, providerConfig);

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
