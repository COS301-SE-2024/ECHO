import { NgIf } from '@angular/common';
import { Component} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ThemeService} from '../../services/theme.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { AuthService} from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [
    NgIf,
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogTitle,
    MatInput,
    FormsModule
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent implements OnInit{
  protected username: string | null = '';
  protected imgpath:  string = 'back.jpg';
  constructor(public dialogRef: MatDialogRef<EditProfileModalComponent>, protected themeService: ThemeService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUsername().subscribe((res) => {
      this.username = localStorage.getItem('username');
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges() {
    if (typeof this.username === 'string') {
      localStorage.setItem('username', this.username);
    }
    localStorage.setItem('path', this.imgpath);
    this.dialogRef.close();
  }
}
