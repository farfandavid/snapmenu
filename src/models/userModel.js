import mongoose from 'mongoose';
//import bcrypt from 'bcryptjs';

const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['none', 'basic', 'standar', 'premium'], // Ejemplo de diferentes planes de suscripción
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  paymentDetails: {
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true
    }
  }
});

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    uid: {
      type: String,
      unique: true,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    emailVerified: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    menuList: {
      type: Array,
      required: true
    },
    menuLimit: {
      type: Number,
      required: true
    },
    suscription: {
      type: subscriptionSchema,
      required: false
    }
  },
  {
    timestamps: true
  });

/* userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
}); */
/* export default mongoose.model('User', userSchema); */