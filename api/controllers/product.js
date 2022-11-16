const Product = require("../models/product");
const mongoose = require("mongoose");

exports.product_get_all = async (req, res, next) => {
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
};

exports.product_get_by_id = async (req, res, next) => {
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
};
exports.product_updated = async (req, res, next) => {
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
};

exports.product_deleted = async (req, res, next) => {
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
};

exports.product_created = async (req, res, next) => {
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
};
