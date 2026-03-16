import { Request, Response } from "express";
import { registerSchema, loginSchema } from "@ecommerce/shared";
import * as authService from "../services/auth.service.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.registerUser(data);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      return;
    }
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.loginUser(data);
    res.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      return;
    }
    res.status(401).json({ message: error.message });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await authService.getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
