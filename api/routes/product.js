const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const product = require("../models/product");
const Product = require("../models/product");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", (req, res, next) => {
  Product.find()
    .select(" name price _id")
    .exec()
    .then((docs) => {
      if (docs) {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                type: "Get",
                url: "http://localhost:3001/products/" + doc.id,
              },
            };
          }),
        };
        res.status(200).json(response);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: err });
    });
});

// creation of product

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "Post",
            url: "http://localhost:3001/products/" + result.id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")

    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "not valid entry found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndUpdate(
    { _id: id },
    { $set: { name: req.body.name, price: req.body.price } }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "Get",
          url: "http://localhost:3001/products/" + result.id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
