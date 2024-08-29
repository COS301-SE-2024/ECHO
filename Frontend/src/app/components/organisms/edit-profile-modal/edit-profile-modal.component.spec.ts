import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EditProfileModalComponent } from './edit-profile-modal.component';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';

describe('EditProfileModalComponent', () => {
    let component: EditProfileModalComponent;
    let fixture: ComponentFixture<EditProfileModalComponent>;
    let mockDialogRef: MatDialogRef<EditProfileModalComponent>;
    let mockThemeService: ThemeService;
    let mockAuthService: AuthService;

    beforeEach(async () => {
        mockDialogRef = { close: jest.fn() } as any;
        mockThemeService = {} as any;
        mockAuthService = {
          currentUser: jest.fn().mockReturnValue(of({
              user: {
                  user_metadata: { name: 'Test User' }
              }
          }))
      } as any;

        await TestBed.configureTestingModule({
            imports: [EditProfileModalComponent, HttpClientTestingModule], // add HttpClientTestingModule here
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: ThemeService, useValue: mockThemeService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditProfileModalComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
      
      describe('Functionality', () => {
        it('should close the dialog when onNoClick is called', () => {
          component.onNoClick();
          expect(mockDialogRef.close).toHaveBeenCalled();
        });
      
        it('should close the dialog when saveChanges is called', () => {
          component.saveChanges();
          expect(mockDialogRef.close).toHaveBeenCalled();
        });
      });
      
});