const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order");
const checkAuth = require("../middleware/checkauth");

/**
 * @method: GET
 * @description: get all the orders
 * @url : http://localhost:3001/orders/
 */

router.get("/", checkAuth, ordersController.orders_get_all);

/**
 * @method: Post
 * @description: create an orders
 * @url : http://localhost:3001/orders/
 */

router.post("/", ordersController.order_create);

/**
 * @method: GET
 * @description: get a specific order
 * @url : http://localhost:3001/orders/:orderId
 */

router.get("/:orderId", ordersController.order_by_id);

router.patch("/:ordertId", (req, res, next) => {
  res.status(201).json({ message: "order details" });
});

/**
 * @method: Delete
 * @description: delete a specific order
 * @url : http://localhost:3001/orders/:orderId
 */

router.delete("/:orderId", ordersController.order_delete);
module.exports = router;
