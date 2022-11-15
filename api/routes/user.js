const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        console.log("this email adress exist ");
        return res.status(409).json({ message: "Email adress already used" });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
        });
        user
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User created ",
              newUser: {
                password: result.password,
                email: result.email,
                _id: result._id,
              },
              request: {
                type: "Get",
                url: "http://localhost:3001/user/" + result._id,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Auth failed " });
      }

      bcrypt.compare(req.body.password, user.password, (mist, result) => {
        if (mist) {
          console.log("failed");
          return res.status(401).json({ error: "Auth failed " });
        } else if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              _id: user._id,
            },
            process.env.TOKEN,
            {
              expiresIn: "1h",
            }
          );

          return res
            .status(200)
            .json({ message: "login successfuly", token: token });
        }
      });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "user deleted" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});
module.exports = router;
