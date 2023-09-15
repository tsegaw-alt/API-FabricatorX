import express from "express";
import { ProductsController } from "./products.controllers";
import { ProductService } from "../services/products.service";
import { Permission } from "../../../../config/permissions";
import { authorize } from "../../../auth/v1/middlewares/authorize";
import { authenticate } from "../../../auth/v1/middlewares/authenticate";

const router = express.Router();
const productService = new ProductService();
const productsController = new ProductsController(productService);

router.get(
  "/",
  authenticate,
  authorize(Permission.VIEW_PRODUCT),
  async (req, res) => {
    if (req.query.query) {
      await productsController.searchProducts(req, res);
    } else {
      await productsController.getProducts(req, res);
    }
  }
);

router.get(
  "/:id",
  authenticate,
  authorize(Permission.VIEW_PRODUCT),
  async (req, res) => {
    await productsController.getProductById(req, res);
  }
);

router.post(
  "/",
  authenticate,
  authorize(Permission.CREATE_PRODUCT),
  async (req, res) => {
    await productsController.createProduct(req, res);
  }
);

router.put(
  "/:id",
  authenticate,
  authorize(Permission.UPDATE_PRODUCT),
  async (req, res) => {
    await productsController.updateProductById(req, res);
  }
);

router.delete(
  "/:id",
  authenticate,
  authorize(Permission.DELETE_PRODUCT),
  async (req, res) => {
    await productsController.deleteProductById(req, res);
  }
);

export default router;
