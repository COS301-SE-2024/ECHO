import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {User } from './user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: { email: string, username: string, password: string }) {
        if (!createUserDto.email || !createUserDto.username || !createUserDto.password) {
            return {error: 'User not created',
                    message: 'Please provide an email, username, and password'
            };
        }
        return this.userService.create(createUserDto.email, createUserDto.username, createUserDto.password);
    }

    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string) {
        return this.userService.validateUser(username, password);
    }

    @Get(':username')
    async getUser(@Param('username') username: string) {
        return this.userService.findOne(username);
    }
}
