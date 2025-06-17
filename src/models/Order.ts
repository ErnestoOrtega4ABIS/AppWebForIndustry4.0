import { Document, Schema, Types, model } from 'mongoose';

export interface IOrderProduct {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    _id: Types.ObjectId;
    IDUser: string;
    createDate: Date;
    updateDate: Date | null;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Deleted';
    products: IOrderProduct[];
    total: number;
    subTotal: number;
}

const orderProductSchema = new Schema<IOrderProduct>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    _id: false,
    versionKey: false
});

const orderSchema = new Schema<IOrder>({
    IDUser: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: null
    },
    products: {
        type: [orderProductSchema],
        required: true,
        validate: {
            validator: (array: IOrderProduct[]) => array.length > 0,
            message: "Debe contener al menos un producto"
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', "Deleted"],
        default: 'Pending'
    },
    total: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

export const Order = model<IOrder>('Order', orderSchema, 'orders');
