import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {User, UserDocument} from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    async findOne(username: string): Promise<any | undefined> {
        var user =  this.userModel.findOne({username}).exec();

        if (user) {
            return user;
        }
        return {
            error: 'User not found',
            message: 'The user with the provided username does not exist'
        }

    }

    async create(email: string, username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({username, password: hashedPassword, email, spotifyConnected: false});
        return newUser.save();
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const userObject = user.toObject();
            delete userObject.password;
            return {message: 'Login successful', user: userObject};
        }
        return {
            error: 'Login failed',
            message: 'Invalid username or password}'
        }
    }
}
