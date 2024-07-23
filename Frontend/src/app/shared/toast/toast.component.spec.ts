import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { CommonModule } from '@angular/common';
import { IterableDiffers } from '@angular/core';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.message).toBe('');
    expect(component.type).toBe('success');
    expect(component.isVisible).toBe(false);
  });

  it('showToast should set message, type, isVisible, and emit close after 3 seconds', fakeAsync(() => {
    jest.spyOn(component.close, 'emit');
    component.showToast('Test Message', 'error');
    expect(component.message).toBe('Test Message');
    expect(component.type).toBe('error');
    expect(component.isVisible).toBe(true);
    tick(3000);
    expect(component.isVisible).toBe(false);
    expect(component.close.emit).toHaveBeenCalled();
  }));

  it('showToast should set message, type, isVisible, and emit close after 3 seconds', fakeAsync(() => {
    jest.spyOn(component.close, 'emit');
    component.showToast('Test Message', 'error');
    expect(component.message).toBe('Test Message');
    expect(component.type).toBe('error');
    expect(component.isVisible).toBe(true);
    tick(3000);
    expect(component.isVisible).toBe(false);
    expect(component.close.emit).toHaveBeenCalled();
    }));

  it('hideToast should set isVisible to false and emit close', () => {
    jest.spyOn(component.close, 'emit');
    component.isVisible = true; // Manually set to simulate visible toast
    component.hideToast();
    expect(component.isVisible).toBe(false);
    expect(component.close.emit).toHaveBeenCalled();
  });

  describe('getToastClasses', () => {
    it('should return correct class for success type', () => {
      component.type = 'success';
      expect(component.getToastClasses()).toEqual({
        'bg-green-500': true,
        'bg-red-500': false,
        'bg-blue-500': false,
      });
    });
  
    it('should return correct class for error type', () => {
      component.type = 'error';
      expect(component.getToastClasses()).toEqual({
        'bg-green-500': false,
        'bg-red-500': true,
        'bg-blue-500': false,
      });
    });
  
    it('should return correct class for info type', () => {
      component.type = 'info';
      expect(component.getToastClasses()).toEqual({
        'bg-green-500': false,
        'bg-red-500': false,
        'bg-blue-500': true,
      });
    });
  });

});