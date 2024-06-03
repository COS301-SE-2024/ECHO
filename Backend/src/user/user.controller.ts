import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('register')
  async register(@Body() createUserDto: { email: string, username: string, password: string }) {
    if (!createUserDto.email || !createUserDto.username || !createUserDto.password) {
      return { error: 'User not created', message: 'Please provide an email, username, and password' };
    }

    const user = await this.userService.create(createUserDto.email, createUserDto.username, createUserDto.password);

    if (user) {
      this.saveCurrentUserToFile({name: createUserDto.username});
    }

    return user;
  }

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.userService.validateUser(username, password);

    if (user) {
      this.saveCurrentUserToFile({ name: username });
    }

    return user;
  }


  @Get('find/:username')
  async getUser(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Get('loggedIn')
  async loggedIn() {
    return this.userService.loggedIn();
  }

  @Get('currentUsername')
  async getCurrentUsername() {console.log('Getting current user');
    const filePath = path.join(__dirname, '../../src/user/currentUser/currentUser.json');
    console.log('File path:', filePath);

    try {
      const user = fs.readFileSync(filePath, 'utf8');
      console.log('File content:', user);

      const parsedUser = JSON.parse(user);
      console.log('Parsed user:', parsedUser);

      return parsedUser;
    } catch (err) {
      console.error('Error reading file:', err);
      return { name: '' };
    }
  }

  @Get('set/:username')
  async setCurrentUsername(@Param('username') username: string) {
    const filePath = path.join(__dirname, '../../src/user/currentUser/currentUser.json');
    fs.writeFile(filePath, JSON.stringify({name: username}, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Current user saved to file successfully');
      }
    });

    return { name: username };
  }

  @Post('updateUsername')
  async updateUsername(@Body('username') username: string) {
    console.log('Updating username to:', username);
    const currentUser = await this.getCurrentUsername();
    const updatedUser = await this.userService.updateUsername(currentUser.name, username);

    if (updatedUser) {
      this.saveCurrentUserToFile({ name: username });
    }

    return updatedUser;
  }

    saveCurrentUserToFile(user: { name: string }) {
    const filePath = path.join(__dirname, '../../src/user/currentUser/currentUser.json');

    // Log the user data to be saved
    console.log('Saving user to file:', user);

    fs.writeFile(filePath, JSON.stringify(user, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Current user saved to file successfully');
      }
    });
  }
}
