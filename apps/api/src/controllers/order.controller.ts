import { Response } from "express";
import { createOrderSchema } from "@ecommerce/shared";
import * as orderService from "../services/order.service.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function create(req: AuthRequest, res: Response) {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(req.userId!, data);
    res.status(201).json(order);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      return;
    }
    res.status(400).json({ message: error.message });
  }
}

export async function getUserOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await orderService.getUserOrders(req.userId!);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const order = await orderService.getOrderById(Number(req.params.id));
    if (!order) {
      res.status(404).json({ message: "Orden no encontrada" });
      return;
    }
    // Only allow users to see their own orders (or admins)
    if (order.userId !== req.userId && req.userRole !== "admin") {
      res.status(403).json({ message: "Acceso denegado" });
      return;
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
