import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle
} from "@angular/material/dialog";
import { ThemeService } from "../../../services/theme.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { OnInit, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-edit-profile-modal",
  standalone: true,
  imports: [
    NgIf,
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogTitle,
    MatInput,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: "./edit-profile-modal.component.html",
  styleUrl: "./edit-profile-modal.component.css"
})
export class EditProfileModalComponent implements OnInit, AfterViewInit {
  protected username: string | null = "";
  protected imgpath: string = "back.jpg";

  constructor(
    public dialogRef: MatDialogRef<EditProfileModalComponent>,
    protected themeService: ThemeService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let user = this.authService.currentUser().subscribe((data: any) => {
      this.username = data.user.user_metadata.name;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges() {
    this.dialogRef.close();
  }

  user() {
    if (localStorage.getItem("imgpath") != null) {
      // @ts-ignore
      this.imgpath = localStorage.getItem("imgpath");
    }
  }
}
