import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User, UserDocument } from "./user.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async findOne(username: string): Promise<any | undefined> {
    var user = await this.userModel.findOne({ username }).exec();

    if (user) {
      return user;
    }
    return {
      error: "User not found",
      message: "The user with the provided username does not exist",
    };
  }

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      email,
      spotifyConnected: false,
    });
    await newUser.save();
    this.configService.set<boolean>("userLoggedIn", true);
    return { message: "Creation successful,", user: newUser };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObject = user.toObject();
      delete userObject.password;
      this.configService.set<boolean>("userLoggedIn", true);
      return { message: "Login successful", user: userObject };
    }
    return {
      error: "Login failed",
      message: "Invalid username or password",
    };
  }

  async loggedIn(): Promise<boolean> {
    return this.configService.get<boolean>("userLoggedIn");
  }
}
