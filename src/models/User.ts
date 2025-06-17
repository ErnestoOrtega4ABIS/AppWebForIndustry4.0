import { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    status: boolean;
    createDate: Date;
    deleteDate: Date;
    role: IUserRole[];
    firstName: string;
    lastName: string;
}

export interface IUserRole {
    roleId: Types.ObjectId;
    roleName: string;
    type: string;
}

export const userRoleSchema = new Schema<IUserRole>({
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },

    roleName: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    }
})

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
        type: [userRoleSchema],
        required: true,
        validate: {
            validator: (array: IUserRole[]) => array.length > 0,
            message: "It may has at least one role"
        }
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