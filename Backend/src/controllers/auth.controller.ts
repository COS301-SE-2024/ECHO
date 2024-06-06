import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    async signIn(@Body() authDto: AuthDto) {
        return this.authService.signIn(authDto);
    }

    @Post('signup')
    async signUp(@Body() body: { email: string; password: string; metadata: any }) {
        const { email, password, metadata } = body;
        return this.authService.signUp(email, password, metadata);
    }

    @Post('signout')
    async signOut() {
        return this.authService.signOut();
    }
}