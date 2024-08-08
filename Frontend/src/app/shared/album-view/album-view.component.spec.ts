import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewComponent } from './album-view.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlbumViewComponent', () => {
  let component: AlbumViewComponent;
  let fixture: ComponentFixture<AlbumViewComponent>;
  let mockDialogRef: MatDialogRef<AlbumViewComponent>;
  
  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [AlbumViewComponent, CommonModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the selectedAlbum input set correctly', () => {
    const album = { title: 'Test Album' };
    component.selectedAlbum = album;
    fixture.detectChanges();
    expect(component.selectedAlbum).toBe(album);
  });

  it('should call close on MatDialogRef when closeModal is called', () => {
    component.closeModal();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
