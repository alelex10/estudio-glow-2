import { db } from "../db/connection.js";
import { orders, orderItems, products } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { CreateOrderInput } from "@ecommerce/shared";

export async function createOrder(userId: number, data: CreateOrderInput) {
  let total = 0;
  
  // Need to process items asynchronously
  const itemsWithPrices = await Promise.all(
    data.items.map(async (item) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      if (!product) {
        throw new Error(`Producto con id ${item.productId} no encontrado`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}"`);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  // Create order
  const [order] = await db
    .insert(orders)
    .values({
      userId,
      total,
      shippingAddress: data.shippingAddress,
      phone: data.phone,
    })
    .returning();

  // Create order items and update stock
  for (const item of itemsWithPrices) {
    await db.insert(orderItems)
      .values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, item.productId));

    if (product) {
      await db.update(products)
        .set({ stock: product.stock - item.quantity })
        .where(eq(products.id, item.productId));
    }
  }

  return order;
}

export async function getUserOrders(userId: number) {
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId));

  return await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, item.productId));

          return { ...item, product };
        })
      );

      return { ...order, items: itemsWithProducts };
    })
  );
}

export async function getOrderById(orderId: number) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      return { ...item, product };
    })
  );

  return { ...order, items: itemsWithProducts };
}
