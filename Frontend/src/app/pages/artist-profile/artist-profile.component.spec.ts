import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ArtistProfileComponent } from './artist-profile.component';

describe('ArtistProfileComponent', () => {
    let component: ArtistProfileComponent;
    let fixture: ComponentFixture<ArtistProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtistProfileComponent, HttpClientModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtistProfileComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
