import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { productName, price, quantity, description } = req.body

        //Check if the product already exists
        const existingProdcut = await Product.findOne({ productName });
        if (existingProdcut) {
            return res.status(400).json({ message: "Product already exists" });
        }

        const newProduct = new Product({
            productName,
            price,
            quantity,
            description
        });

        const product = await newProduct.save();
        return res.json({ product });


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ status: { $ne: false } }).sort({ createDate: -1 });

        return res.status(200).json({ products })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { productName, price, quantity, description } = req.body;

        // Verify if the product exists
        const product = await Product.findById(id);
        if (!product || product.status === false) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify if the product already exists
        if (productName && productName !== product.productName) {
            const existing = await Product.findOne({ productName });
            if (existing) {
                return res.status(400).json({ message: 'Another product with the same name already exists' });
            }
        }

        //Update products
        product.productName = productName ?? product.productName;
        product.price = price ?? product.price;
        product.quantity = quantity ?? product.quantity;
        product.description = description ?? product.description;

        // Save the product in DB
        const updatedProduct = await product.save();
        return res.status(200).json({ product: updatedProduct });

    } catch (error) {
        return res.status(500).json({ message : 'Internal Server Error' })
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not foud' });
        }

        if (product.status == false) {
            return res.status(400).json({ message: 'Product is already product' });
        }

        product.status = false

        await product.save();

        return res.status(200).json({ message: 'Product deleted', product })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};