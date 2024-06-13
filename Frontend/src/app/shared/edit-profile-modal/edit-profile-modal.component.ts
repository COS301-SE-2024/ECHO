import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatDialogActions,
    MatDialogContent,
    MatDialogModule,
    MatDialogTitle,
} from '@angular/material/dialog';
import { ThemeService } from '../../services/theme.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { OnInit, AfterViewInit } from '@angular/core';

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
        FormsModule,
        MatDialogModule
    ],
    templateUrl: './edit-profile-modal.component.html',
    styleUrl: './edit-profile-modal.component.css',
})
export class EditProfileModalComponent implements OnInit, AfterViewInit {
    protected username: string | null = '';
    protected imgpath: string = 'back.jpg';

    constructor(
        public dialogRef: MatDialogRef<EditProfileModalComponent>,
        protected themeService: ThemeService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.authService.currentUsername().subscribe((res) => {
            this.username = localStorage.getItem('username');
        });
    }

    ngAfterViewInit() {
        this.authService.currentUsername().subscribe((res) => {
            this.username = res.name;
        });

        if (this.username != null)
            if (localStorage.getItem('path') != null) {
                // @ts-ignore
                this.imgpath = localStorage.getItem('path');
            }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    saveChanges() {
        if (this.username) {
            this.authService.saveUsername(this.username).subscribe((res) => {});
            localStorage.setItem('path', this.imgpath);

            this.authService
                .updateUsername(this.username)
                .subscribe((res) => {});
            this.dialogRef.close();
        }
    }

    user() {
        this.authService.currentUsername().subscribe((res) => {
            this.username = res.name;
        });
        if (localStorage.getItem('imgpath') != null) {
            // @ts-ignore
            this.imgpath = localStorage.getItem('imgpath');
        }
    }
}
