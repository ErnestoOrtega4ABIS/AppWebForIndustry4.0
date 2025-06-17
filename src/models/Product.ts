import { Document, Schema, Types, model } from 'mongoose';

export interface IProduct extends Document {
    _id: Types.ObjectId;
    productName: string;
    price: number;
    quantity: number;
    status: boolean;
    description: string;
    createDate: Date;
    deleteDate: Date;
}

const productSchema = new Schema<IProduct>({
    productName: {
        type: String,
        required: true,
        unique: true,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: Boolean,
        default: true
    },

    description: {
        type: String,
        required: true,
    },

    createDate: {
        type: Date,
        default: Date.now
    },

    deleteDate: {
        type: Date,
        default: null
    }
}, 
{
    versionKey: false,
});

export const Product = model<IProduct>('Product', productSchema);