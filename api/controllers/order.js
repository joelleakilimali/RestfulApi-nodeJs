const Order = require("../models/order");
const mongoose = require("mongoose");
const Product = require("../models/product");

exports.orders_get_all = async (req, res, next) => {
  Order.find()
    .select("_id product quatity")
    .populate("product", "name _id")
    .exec()
    .then((docs) => {
      if (docs) {
        const orders = docs;
        res.status(201).json({
          message: "orders fetched",
          count: orders.length,
          orders: orders.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "Get",
                url: "http://localhost:3001/orders/" + doc._id,
              },
            };
          }),
        });
      }
    })

    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
exports.order_create = async (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        res.status(500).json({ message: "there is no this product" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "order stored",
            newOrder: {
              product: result.product,
              quantity: result.quantity,
              _id: result._id,
            },
            request: {
              type: "Get",
              description: "get your new order",
              url: "http://localhost:3001/orders/" + result.id,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({ message: "Product not found", error: err });
        });
    });
};
exports.order_by_id = async (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("product _id quantity")
    .populate("product")

    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "order not found" });
      }
      res.status(201).json({ order });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.order_delete = async (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(201).json({ message: "order deleted" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
