import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().positive("El precio debe ser positivo"),
  description: z.string().min(1, "La descripción es requerida"),
  image: z.string().url("URL de imagen inválida").optional(),
  category: z.string().min(1, "La categoría es requerida"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
