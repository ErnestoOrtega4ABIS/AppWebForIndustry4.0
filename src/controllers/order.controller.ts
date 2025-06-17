import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

export const saveOrder = async (req: Request, res: Response) => {
    try {
        const { IDUser, products } = req.body;

        // Validaciones básicas
        if (!IDUser || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Missing user ID or products in request" });
        }

        const user = await User.findById(IDUser);
        if (!user || !user.status) {
            return res.status(404).json({ message: `User with ID ${IDUser} not found or inactive` });
        }


        let subTotal = 0;
        const validatedProducts = [];

        for (const item of products) {
            const { productId, quantity } = item;

            if (!productId || typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({ message: "Each product must have a valid productId and quantity > 0" });
            }

            const product = await Product.findById(productId);

            if (!product || !product.status) {
                return res.status(404).json({ message: `Product with ID ${productId} not found or inactive` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ message: `Not enough stock for product: ${product.productName}` });
            }

            validatedProducts.push({
                productId,
                quantity,
                price: product.price
            });

            subTotal += product.price * quantity;

            // Descontar la cantidad del producto
            product.quantity -= quantity;
            await product.save();
        }

        const total = parseFloat((subTotal * 1.16).toFixed(2)); // IVA 16%

        const newOrder = new Order({
            IDUser,
            products: validatedProducts,
            subTotal,
            total
            // status: 'Pending' se asigna automáticamente por el modelo
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({ message : "Order created succesfully" , order: savedOrder });

    } catch (error) {
        console.error("Error saving order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Deleted' } }).sort({ createDate: -1 });

        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['Shipped', 'Delivered', 'Cancelled'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Actualizamos solo el status y la fecha de actualización
        order.status = status;
        order.updateDate = new Date();

        await order.save();

        return res.json({ message: 'Order status updated', order });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Deleted') {
            return res.status(400).json({ message: 'Order is already deleted' });
        }

        order.status = 'Deleted';
        order.updateDate = new Date();

        await order.save();

        return res.json({ message: 'Order deleted', order });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


