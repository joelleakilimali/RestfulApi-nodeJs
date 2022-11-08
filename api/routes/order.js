const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "order fetched" });
});

router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({ message: "order was created", order: order });
});

router.get("/:orderId", (req, res, next) => {
  res
    .status(201)
    .json({ message: "order details", orderId: req.params.orderId });
});

router.patch("/:ordertId", (req, res, next) => {
  res.status(201).json({ message: "order details" });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({ message: "deleted order" });
});
module.exports = router;
