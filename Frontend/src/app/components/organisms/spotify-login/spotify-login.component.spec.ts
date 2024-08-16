import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotifyLoginComponent } from './spotify-login.component';
import { ProviderService } from '../../services/provider.service';
import { AriaDescriber } from '@angular/cdk/a11y';

const providerServiceMock = {
    setProviderName: jest.fn()
};

describe('SpotifyLoginComponent', () => {
    let component: SpotifyLoginComponent;
    let fixture: ComponentFixture<SpotifyLoginComponent>;
    let providerService: ProviderService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SpotifyLoginComponent],
            providers: [{provide: ProviderService, useValue: providerServiceMock }]
        }).compileComponents();

        fixture = TestBed.createComponent(SpotifyLoginComponent);
        component = fixture.componentInstance;
        providerService = TestBed.inject(ProviderService);
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('loginWithSpotify', () => {
        it('should call setProviderName with "spotify" when loginWithSpotify is called', () => {
            component.loginWithSpotify();
            expect(providerService.setProviderName).toHaveBeenCalledWith('spotify');
        });

        it('should log "Logging in with Spotify" to the console when loginWithSpotify is called', () => {
            console.log = jest.fn();
            component.loginWithSpotify();
            expect(console.log).toHaveBeenCalledWith('Logging in with Spotify');
        });
    });
});
