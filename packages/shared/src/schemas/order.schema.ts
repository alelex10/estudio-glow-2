import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive("La cantidad debe ser al menos 1"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Debe incluir al menos un producto"),
  shippingAddress: z.string().min(5, "La dirección es requerida"),
  phone: z.string().min(5, "El teléfono es requerido"),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
