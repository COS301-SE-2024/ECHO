import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArtistProfileComponent } from './artist-profile.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { SpotifyService } from "../../services/spotify.service";

describe('ArtistProfileComponent', () => {
    let component: ArtistProfileComponent;
    let fixture: ComponentFixture<ArtistProfileComponent>;
    let authServiceMock: any;
    let themeServiceMock: any;
    let screenSizeServiceMock: any;
    let dialogMock: any;
    let spotifyServiceMock: any;

    beforeEach(async () => {
        authServiceMock = {
            currentUser: jest.fn().mockReturnValue(of({
                user: {
                    user_metadata: {
                        name: 'Test User',
                        picture: 'test.jpg',
                        username: 'testuser'
                    }
                }
            }))
        };

        themeServiceMock = {
            switchTheme: jest.fn()
        };

        screenSizeServiceMock = {
            screenSize$: of('large')
        };

        dialogMock = {
            open: jest.fn().mockReturnValue({
                afterClosed: jest.fn().mockReturnValue(of(true))
            })
        };

        spotifyServiceMock = {
            init: jest.fn().mockResolvedValue(null)
        };

        await TestBed.configureTestingModule({
            imports: [ArtistProfileComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: ThemeService, useValue: themeServiceMock },
                { provide: ScreenSizeService, useValue: screenSizeServiceMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: SpotifyService, useValue: spotifyServiceMock },
                { provide: Router, useValue: { navigate: jest.fn() } }
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtistProfileComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set username and imgpath after ngAfterViewInit is called', () => {
        component.ngAfterViewInit();
        expect(authServiceMock.currentUser).toHaveBeenCalled();
        expect(component.username).toBe('Test User');
        expect(component.imgpath).toBe('test.jpg');
    });

    it('should call switchTheme on themeService when switchTheme is called', () => {
        component.switchTheme();
        expect(themeServiceMock.switchTheme).toHaveBeenCalled();
    });

    it('should set screenSize after ngOnInit is called', async () => {
        await component.ngOnInit();
        expect(component.screenSize).toBe('large');
        expect(spotifyServiceMock.init).toHaveBeenCalled();
    });

    /*
    it('should open dialog and log after dialog is closed', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        component.openDialog();
        expect(dialogMock.open).toHaveBeenCalled();
        expect(dialogMock.open().afterClosed).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('The dialog was closed');
    });
*/
/*
    it('should set imgpath from localStorage when save is called', () => {
        const mockPath = 'new-path.jpg';
        jest.spyOn(localStorage, 'getItem').mockReturnValue(mockPath);
        component.save();
        expect(component.imgpath).toBe(mockPath);
    });
*/
    it('should update username when refresh is called', () => {
        component.refresh();
        expect(authServiceMock.currentUser).toHaveBeenCalled();
        expect(component.username).toBe('testuser');
    });

    it('should return album art path when getAlbumArt is called', () => {
        const song = 'HUMBLE.';
        const albumArt = component.getAlbumArt(song);
        expect(albumArt).toBe('../assets/images/damn.jpeg');
    });
});
