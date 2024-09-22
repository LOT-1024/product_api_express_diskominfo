import { Request, Response } from "express";
import db from "../config/databaseConf";
import { RowDataPacket } from "mysql2";
import { OrderRequest, ProductData, Order, Product } from "../types/typesAll";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const [ordersData] = await db.query<RowDataPacket[]>(
      `SELECT id, created_at, updated_at FROM orders`
    );
    const orders: Order[] = [];

    for (const order of ordersData) {
      const orderId = order.id;
      const [productsData] = await db.query<RowDataPacket[]>(
        `
                SELECT p.id, p.name, p.price, oi.quantity, p.stock, p.sold, p.created_at, p.updated_at
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?`,
        [orderId]
      );

      const products: Product[] = productsData.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        stock: product.stock,
        sold: product.sold,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }));

      orders.push({
        id: orderId,
        products,
        created_at: order.created_at,
        updated_at: order.updated_at,
      });
    }

    res.status(200).json({ message: "Order List", data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    const [orderData] = await db.query<RowDataPacket[]>(
      "SELECT id, created_at, updated_at FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderData.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order: Order = {
      id: orderData[0].id,
      created_at: orderData[0].created_at,
      updated_at: orderData[0].updated_at,
      products: [],
    };

    const [productsData] = await db.query<RowDataPacket[]>(
      `
            SELECT p.id, p.name, p.price, oi.quantity, p.stock, p.sold, p.created_at, p.updated_at
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
            `,
      [orderId]
    );

    const products: Product[] = productsData.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      stock: product.stock,
      sold: product.sold,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));

    order.products = products;

    res.status(200).json({
      message: "Order Detail",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { products }: OrderRequest = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input, products array is required." });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      "INSERT INTO orders (created_at, updated_at) VALUES (NOW(), NOW())"
    );
    const orderId = (orderResult as any).insertId;
    const insertedProducts: ProductData[] = [];

    for (const product of products) {
      const { id: productId, quantity } = product;
      const [productData] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ?",
        [productId]
      );

      if (!productData || productData.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ message: `Product with id ${productId} not found.` });
      }

      const currentProduct = productData[0] as ProductData;
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, productId, quantity, currentProduct.price]
      );

      const newStock = currentProduct.stock - quantity;
      const newSold = currentProduct.sold + quantity;

      await connection.query(
        "UPDATE products SET stock = ?, sold = ?, updated_at = NOW() WHERE id = ?",
        [newStock, newSold, productId]
      );
      insertedProducts.push({
        ...currentProduct,
        stock: newStock,
        sold: newSold,
      });
    }

    await connection.commit();
    connection.release();

    res
      .status(201)
      .json({
        message: "Order created",
        data: {
          id: orderId,
          products: insertedProducts,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
  } catch (error) {
    console.error("Order creation failed:", error);
    const connection = await db.getConnection();
    await connection.rollback();
    connection.release();
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    const [orderData] = await db.query<RowDataPacket[]>(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderData.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [productsData] = await db.query<RowDataPacket[]>(
      `
            SELECT p.id, p.name, p.price, oi.quantity, p.stock, p.sold, p.created_at, p.updated_at
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
            `,
      [orderId]
    );

    await db.query("DELETE FROM orders WHERE id = ?", [orderId]);

    const products: Product[] = productsData.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      stock: product.stock,
      sold: product.sold,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));

    res.status(200).json({
      message: "Order deleted successfully",
      data: {
        id: orderId,
        products,
        created_at: orderData[0].created_at,
        updated_at: orderData[0].updated_at,
      },
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
