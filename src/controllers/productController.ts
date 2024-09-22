import { Request, Response } from 'express';
import db from '../config/databaseConf';
import { RowDataPacket } from 'mysql2';
import { Product } from '../types/typesAll';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const [productsData] = await db.query<RowDataPacket[]>(`SELECT id, name, price, stock, sold, created_at, updated_at FROM products`);

        const products: Product[] = productsData.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            sold: product.sold,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }));

        res.status(200).json({
            message: 'Product List',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOneProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
        const [productData] = await db.query<RowDataPacket[]>(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (productData.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product: Product = {
            id: productData[0].id,
            name: productData[0].name,
            price: productData[0].price,
            stock: productData[0].stock,
            sold: productData[0].sold,
            created_at: productData[0].created_at,
            updated_at: productData[0].updated_at,
        };

        res.status(200).json({
            message: 'Product Detail',
            data: product,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ message: 'Name, price, and stock are required' });
    }

    try {
        const [result] = await db.query<RowDataPacket[]>(
            `INSERT INTO products (name, price, stock, sold, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [name, price, stock, 0]
        );

        const newProductId = (result as any).insertId;

        const [newProductData] = await db.query<RowDataPacket[]>(
            `SELECT id, name, price, stock, sold, created_at, updated_at FROM products WHERE id = ?`,
            [newProductId]
        );

        const newProduct = newProductData[0];

        res.status(201).json({
            message: 'Product created successfully',
            data: {
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                stock: newProduct.stock,
                sold: newProduct.sold,
                created_at: newProduct.created_at,
                updated_at: newProduct.updated_at,
            },
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
        return res.status(400).json({ message: "Invalid input, name, price, and stock are required." });
    }

    try {
        const [existingProductData] = await db.query<RowDataPacket[]>(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (existingProductData.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await db.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, updated_at = NOW() WHERE id = ?',
            [name, price, stock, productId]
        );

        const [updatedProductData] = await db.query<RowDataPacket[]>(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        const updatedProduct: Product = {
            id: updatedProductData[0].id,
            name: updatedProductData[0].name,
            price: updatedProductData[0].price,
            stock: updatedProductData[0].stock,
            sold: updatedProductData[0].sold,
            created_at: updatedProductData[0].created_at,
            updated_at: updatedProductData[0].updated_at,
        };

        res.status(200).json({
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;

    try {
        const [existingProductData] = await db.query<RowDataPacket[]>(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (existingProductData.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await db.query(
            'DELETE FROM products WHERE id = ?',
            [productId]
        );

        const deletedProduct: Product = {
            id: existingProductData[0].id,
            name: existingProductData[0].name,
            price: existingProductData[0].price,
            stock: existingProductData[0].stock,
            sold: existingProductData[0].sold,
            created_at: existingProductData[0].created_at,
            updated_at: existingProductData[0].updated_at,
        };

        res.status(200).json({
            message: 'Product deleted successfully',
            data: deletedProduct,
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};