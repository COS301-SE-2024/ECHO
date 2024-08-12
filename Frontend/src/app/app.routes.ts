import { RouterModule, Routes } from "@angular/router";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { AuthCallbackComponent } from "./authcallback/authcallback.component";
import { UserLibraryComponent } from "./pages/user-library/user-library.component";
import { ArtistProfileComponent } from "./pages/artist-profile/artist-profile.component";
import { SearchComponent } from "./pages/search/search.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { MoodComponent } from "./pages/mood/mood.component";
import { NgModule } from "@angular/core";
import { InsightsComponent } from "./pages/insights/insights.component";
import { HelpMenuComponent } from "./pages/help-menu/help-menu.component";

export const routes: Routes = [
  { path: "landing", component: LandingPageComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "home", component: HomeComponent, children: [
      { path: "search", component: SearchComponent },
      { path: "library", component: UserLibraryComponent }]
  },
  { path: "profile", component: ProfileComponent },
  { path: "mood", component: MoodComponent },
  { path: "auth/callback", component: AuthCallbackComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "settings", component: SettingsComponent },
  { path: "artist-profile", component: ArtistProfileComponent },
  { path: "help", component: HelpMenuComponent },
  {path: "insights", component: InsightsComponent},
  {path: "insights", component: InsightsComponent},
  {path: "search", component: SearchComponent}
  //{ path: "**", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutesModule
{
}
