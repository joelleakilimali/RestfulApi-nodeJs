//in here we will use express that will help us to handle our request easily
//code are execute in sequence

const express = require("express");
const app = express(); // kind of saving all the function of express in this variable like an object from the classexpress
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("database connected !!"));

const productRoutes = require("./api/routes/product.js"); //this variable is kind of pointing the file product.js so that all the middlware of app.use using this variable will go there
const orderRoutes = require("./api/routes/order");
const userRoutes = require("./api/routes/user");
const basketRoutes = require("./api/routes/basket.js");

app.use(morgan("dev")); // help us to see the type of request that we have made , the status and the route we used
app.use(bodyParser.urlencoded({ extended: false })); // determine type of data we gonna parse
app.use(bodyParser.json());

// before going throught the route we need to deal with cors , to allow any origin to come to our server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-requested-with,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

// Routes to handle
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/basket", basketRoutes);

//if we enter a route that is not valid it will come here (1)
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
//then here (2)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

module.exports = app;
