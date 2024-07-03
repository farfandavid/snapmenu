import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: false
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  });

const categorySchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    products: {
      type: [productSchema],
      required: false
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  });


const menuSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      unique: true,
      required: true
    },
    userEmail: {
      type: String,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    categories: {
      type: [categorySchema],
      required: false
    },
    active: {
      type: Boolean,
      required: false
    },
    expDate: {
      type: Date,
      required: false
    },
    logoUrl: {
      type: String,
      required: false
    },
    bannerUrl: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    mapUrl: {
      type: String,
      required: false
    },
    social: {
      type: Object,
      required: false
    },
    openingHours: {
      type: [Object],
      required: false
    },
  },
  {
    timestamps: true
  });

menuSchema.pre("save", function (next) {
  console.log("Pre save");
  const currentDate = new Date();
  this.active = this.expDate > currentDate;
  next();
});

export default mongoose.model("Menu", menuSchema)
