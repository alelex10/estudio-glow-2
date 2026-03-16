import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/categories", productController.getCategories);
router.get("/:id", productController.getById);

// Admin only
router.post("/", authMiddleware, adminMiddleware, productController.create);
router.put("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete("/:id", authMiddleware, adminMiddleware, productController.remove);

export default router;
