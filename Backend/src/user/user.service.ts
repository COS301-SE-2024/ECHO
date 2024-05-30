import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findOne(username: string): Promise<UserDocument | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async create(username: string, email: string, password: string): Promise<UserDocument> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ username, password: hashedPassword, email });
        return newUser.save();
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        }
        return null;
    }
}
