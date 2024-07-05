import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  _id: String,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category_id: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic",
    required: true,
    ref: 'Category'
  },
  quantity: {
    type: Number,
    required: true
  },
  unit_price: {
    type: Number,
    required: true
  },
  currency_id: {
    type: String,
    required: true
  },
});

const payerSchema = new mongoose.Schema({
  _id: String,
  email: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  account_id: {
    type: String,
    required: true,
    ref: 'User'
  },
});

const paymentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id_transaction: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    required: true
  },
  date_approved: {
    type: Date,
    required: false
  },
  date_last_updated: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  status_detail: {
    type: String,
    required: false
  },
  payment_method: {
    type: String,
    required: true
  },
  currency_id: {
    type: String,
    required: true
  },
  transaction_amount: {
    type: Number,
    required: true
  },
  transaction_amount_refunded: {
    type: Number,
    required: false
  },
  payer: {
    type: payerSchema,
    required: true
  },
  items: {
    type: [itemSchema],
    required: true
  },
});