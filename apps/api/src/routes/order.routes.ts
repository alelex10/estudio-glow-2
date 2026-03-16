import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.post("/", orderController.create);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getById);

export default router;
