import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
    let component: AppComponent;

    beforeEach(() => {
        component = new AppComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a title', () => {
        expect(component.title).toBe('Echo');
    });
});
