const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const product = require("../models/product");
const Product = require("../models/product");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const checkAuth = require("../middleware/checkauth");
const productController = require("../controllers/product");

/**
 * @method: GET
 * @description: get all the products
 * @url : http://localhost:3001/products/
 */

router.get("/", productController.product_get_all);

/**
 * @method: GET
 * @description: Getting a specific products
 * @url : http://localhost:3001/products/
 */
router.get("/:productId", productController.product_get_by_id);

/**
 * @method: Patch
 * @description: updating a specific products
 * @url : http://localhost:3001/products/:productId
 */

router.patch("/:productId", productController.product_updated);

/**
 * @method: Delete
 * @description: Delete a specific products
 * @url : http://localhost:3001/products/:productId
 */

router.delete("/:productId", productController.product_deleted);

/**
 * @method: Post
 * @description: Create a products
 * @url : http://localhost:3001/products/
 */

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productController.product_created
);

module.exports = router;
