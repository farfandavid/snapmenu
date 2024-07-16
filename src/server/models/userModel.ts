import mongoose, { Model, Schema } from "mongoose";
import { type ISuscription, type IUser } from "../interface/User";

// Assuming UserSchema is already defined as per your excerpt

interface IUserModel extends IUser, Document { }
interface ISuscriptionModel extends ISuscription, Document { }

const suscriptionSchema = new Schema<ISuscriptionModel>({
    plan: {
        type: String,
        enum: ['none', 'basic', 'standar', 'premium'],
    },
    status: {
        type: Boolean,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    paymentDetails: {
        amount: {
            type: Number,
        },
        method: {
            type: String,
        }
    }
})

const userSchemaMongoose = new Schema<IUserModel>({
    displayName: {
        type: String
    },
    uid: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        required: true,
    },
    disabled: {
        type: Boolean,
        required: true,
    },
    suscription: {
        type: suscriptionSchema,
        required: false,
    },
}, {
    timestamps: true,
    _id: true,
});

export const UserModel: Model<IUserModel> = mongoose.model<IUserModel>('User', userSchemaMongoose);