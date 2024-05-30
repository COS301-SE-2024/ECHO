// user.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() body: { username: string; email: string; password: string }): Promise<User> {
        return this.userService.create(body.username, body.email, body.password);
    }

    @Get(':username')
    async findOne(@Param('username') username: string): Promise<User | undefined> {
        return this.userService.findOne(username);
    }
}
