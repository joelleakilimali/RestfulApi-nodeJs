const mongoose = require("mongoose");

const basketSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemNumber: { type: Number, default: 0.0 },
  TotalQuantity: { type: Number, default: 0.0 },
  totalPrice: { type: Number, default: 0.0 },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
  ],
  quantity: { type: Number, default: 1 },
});
module.exports = mongoose.model("Basket", basketSchema);
