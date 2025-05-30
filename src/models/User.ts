import { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    status: boolean;
    createDate: Date;
    deleteDate: Date;
    role: string;
    firstName: string;
    lastName: string;
}

const userSchema = new Schema<IUser>({
    username:{
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
    },

    status: {
        type: Boolean,
        default: true
    },

    createDate: {
        type: Date,
        default: Date.now
    },

    deleteDate: {
        type: Date,
        default: null
    },

    role: {
        type: String,
        required: true,
        default: 'role'
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    }
},
    {
        versionKey: false,
    }
);

export const User = model<IUser>('User', userSchema, 'users')