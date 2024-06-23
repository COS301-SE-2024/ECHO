import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomPlayerComponent } from './bottom-player.component';
import { SpotifyService } from "../../services/spotify.service";
import { AuthService } from "../../services/auth.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('BottomPlayerComponent', () => {
    let component: BottomPlayerComponent;
    let fixture: ComponentFixture<BottomPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BottomPlayerComponent,HttpClientTestingModule],
          providers: [
            AuthService,
            SpotifyService,
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(BottomPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
