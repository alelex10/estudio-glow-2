import { db } from "../db/connection.js";
import { products } from "../db/schema.js";
import { eq, like, and, gte, lte } from "drizzle-orm";
import type { ProductInput } from "@ecommerce/shared";

export async function getAllProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const conditions = [];

  if (filters?.category) {
    conditions.push(eq(products.category, filters.category));
  }
  if (filters?.search) {
    conditions.push(like(products.name, `%${filters.search}%`));
  }
  if (filters?.minPrice !== undefined) {
    conditions.push(gte(products.price, filters.minPrice));
  }
  if (filters?.maxPrice !== undefined) {
    conditions.push(lte(products.price, filters.maxPrice));
  }

  if (conditions.length > 0) {
    return await db
      .select()
      .from(products)
      .where(and(...conditions));
  }

  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0];
}

export async function createProduct(data: ProductInput) {
  const result = await db.insert(products).values(data).returning();
  return result[0];
}

export async function updateProduct(id: number, data: Partial<ProductInput>) {
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return result[0];
}

export async function deleteProduct(id: number) {
  const result = await db.delete(products).where(eq(products.id, id)).returning();
  return result[0];
}

export async function getCategories() {
  const result = await db
    .selectDistinct({ category: products.category })
    .from(products);
  return result.map((r) => r.category);
}
