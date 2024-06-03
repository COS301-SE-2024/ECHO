import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ collection: "users" })
export class User {
    @Prop({ required: true })
    email: string;

    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    spotifyConnected: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
