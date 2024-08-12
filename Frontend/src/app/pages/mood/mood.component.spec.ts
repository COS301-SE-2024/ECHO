import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MoodComponent } from './mood.component';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { MoodService } from '../../services/mood-service.service';

describe('MoodComponent', () => {
    let component: MoodComponent;
    let fixture: ComponentFixture<MoodComponent>;
    let screenSizeService: ScreenSizeService;
    let moodService: MoodService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MoodComponent, HttpClientModule, RouterTestingModule],
            providers: [ScreenSizeService, MoodService]
        }).compileComponents();

        fixture = TestBed.createComponent(MoodComponent);
        component = fixture.componentInstance;

        // Inject the services
        screenSizeService = TestBed.inject(ScreenSizeService);
        moodService = TestBed.inject(MoodService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update the title when the mood is changed', () => {
        const newMood = 'Happy';
        component.changeMood(newMood);
        expect(component.title).toBe(newMood);
    });

    it('should return albums related to the new mood', () => {
        const newMood = 'Sad';
        const albums = component.getAlbumsForMood(newMood);
        expect(albums.length).toBeGreaterThan(0);
        expect(albums[0].title).toContain(newMood);
    });

    it('should update searchQuery when onSearchdown is called', () => {
        const searchSubject = 'Test Query';
        component.onSearchdown(searchSubject);
        expect(component.searchQuery).toBe(searchSubject);
        expect(component.title).toBe('Search');
    });

    it('should navigate to profile when profile() is called', () => {
        const routerSpy = jest.spyOn(component['router'], 'navigate');
        component.profile();
        expect(routerSpy).toHaveBeenCalledWith(['/profile']);
    });
});
