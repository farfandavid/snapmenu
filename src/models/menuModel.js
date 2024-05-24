import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
      required: true
    }
  },
  {
    timestamps: true
  });

menuSchema.pre("save", function (next) {
  try {
    if (typeof this.user === "string") {
      this.user = mongoose.Types.ObjectId(this.user);
    }
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Menu", menuSchema);