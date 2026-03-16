import { Request, Response } from "express";
import { productSchema } from "@ecommerce/shared";
import * as productService from "../services/product.service.js";

export async function getAll(req: Request, res: Response) {
  const filters = {
    category: req.query.category as string | undefined,
    search: req.query.search as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
  };

  try {
    const products = await productService.getAllProducts(filters);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await productService.updateProduct(Number(req.params.id), data);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const product = await productService.deleteProduct(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json({ message: "Producto eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await productService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
