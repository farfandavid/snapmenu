import mongoose, { Document, Schema, Model, Types } from "mongoose";
import type { IUser } from "../interface/User";

const UserSchema = new Schema<IUser>({
    id: { type: String },
    displayName: { type: String },
    uid: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean },
    menuList: { type: [String] },
    menuLimit: { type: Number },
    disabled: { type: Boolean },
});