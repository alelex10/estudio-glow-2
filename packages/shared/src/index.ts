// Schemas
export { registerSchema, loginSchema } from "./schemas/user.schema.js";
export type { RegisterInput, LoginInput } from "./schemas/user.schema.js";

export { productSchema, productFilterSchema } from "./schemas/product.schema.js";
export type { ProductInput, ProductFilter } from "./schemas/product.schema.js";

export { orderItemSchema, createOrderSchema } from "./schemas/order.schema.js";
export type { OrderItemInput, CreateOrderInput } from "./schemas/order.schema.js";

// Types
export type {
  User,
  Product,
  OrderItem,
  Order,
  CartItem,
  AuthResponse,
  ApiError,
} from "./types/index.js";
