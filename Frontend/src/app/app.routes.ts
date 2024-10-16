import { RouterModule, Routes } from "@angular/router";
// import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from "./components/templates/desktop/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { AuthCallbackComponent } from "./authcallback/authcallback.component";
import { UserLibraryComponent } from "./pages/user-library/user-library.component";
import { ArtistProfileComponent } from "./pages/artist-profile/artist-profile.component";
import { SearchComponent } from "./components/templates/desktop/search/search.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { MoodComponent } from "./pages/mood/mood.component";
import { NgModule } from "@angular/core";
import { InsightsComponent } from "./pages/insights/insights.component";
import { HelpMenuComponent } from "./pages/help-menu/help-menu.component";
import { EchoSongComponent } from "./components/templates/desktop/echo-song/echo-song.component";
import { ChatComponent } from "./components/templates/desktop/chat/chat.component";

//vies 
import { LoginComponentview} from "./views/login/login.component";
import { RegisterComponent} from "./views/register/register.component";
import { HomesComponent } from "./views/homes/homes.component";


export const routes: Routes = [
  { path: "login", component: LoginComponentview},
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent },
  { path: "mood", component: MoodComponent },
  { path: "auth/callback", component: AuthCallbackComponent },
  { path: "home", component: HomesComponent},
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "settings", component: SettingsComponent },
  { path: "artist-profile", component: ArtistProfileComponent },
  { path: "help", component: HelpMenuComponent },
  { path: "insights", component: InsightsComponent},
  { path: "search", component: SearchComponent},
  { path: "library", component: UserLibraryComponent},
  { path: "echo Song", component: EchoSongComponent},
  { path: "chat", component: ChatComponent},
  { path: '**', redirectTo: '/login' } //DO NOT MOVE - MUST ALWAYS BE LAST
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})

export class AppRoutesModule
{
}