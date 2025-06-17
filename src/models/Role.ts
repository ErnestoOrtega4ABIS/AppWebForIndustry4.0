import { Document, Schema, Types, model } from 'mongoose';

//Specify that is a document
export interface IRole extends Document {
    _id: Types.ObjectId;
    roleName: string;
    type: string;
    status: boolean;
}

const roleSchema = new Schema<IRole>({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },

    type: {
        type: String,
        required: true,
        enum: ['admin', 'client', 'employee'],
    },

    status: {
        type: Boolean,
        default: true
    }
}, 
    {
        versionKey: false,
    }
);

export const Role = model<IRole>('Role', roleSchema);