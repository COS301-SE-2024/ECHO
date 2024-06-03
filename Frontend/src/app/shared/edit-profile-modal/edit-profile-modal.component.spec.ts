import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EditProfileModalComponent } from './edit-profile-modal.component';

describe('EditProfileModalComponent', () => {
    let component: EditProfileModalComponent;
    let fixture: ComponentFixture<EditProfileModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditProfileModalComponent, HttpClientTestingModule], // add HttpClientTestingModule here
            providers: [
                { provide: MatDialogRef, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditProfileModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});