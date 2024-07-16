import type { Types } from "mongoose";
import { UserError, UserSchema, type ISuscription, type IUser } from "../interface/User";
import { UserModel } from "../models/userModel";
import db from "../config/db";
import { ERROR_MESSAGES } from "../utils/constants";

export class User implements IUser {
    _id?: Types.ObjectId;
    displayName?: string;
    uid?: string;
    email: string;
    emailVerified?: boolean;
    disabled?: boolean;
    suscription?: ISuscription;

    constructor(data: IUser) {
        const validate = UserSchema.safeParse(data);
        if (!validate.success) {
            throw new UserError(validate.error?.flatten().fieldErrors);
        }
        this._id = data._id;
        this.displayName = data.displayName;
        this.uid = data.uid;
        this.email = data.email;
        this.emailVerified = data.emailVerified;
        this.disabled = data.disabled;
        this.suscription = data.suscription;
    }

    validate(): User | UserError {
        const validate = UserSchema.safeParse(this);
        if (!validate.success) {
            throw new UserError(validate.error?.flatten().fieldErrors);
        } else {
            return validate.data as User;
        }
    }
    /**
     * Save a new user in the database
     * @returns User | Error
     */
    async save() {
        try {
            await db.connectDB();
            const user = new UserModel(this);
            await user.save();
            return new User(user);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    /**
     * Update an existing user in the database
     * @returns User | Error | UserError | null
     */
    async update() {
        try {
            if (this.validate() instanceof UserError) {
                throw this.validate();
            }
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, this, { new: true });
            if (!user) return null;
            return new User(user);
        } catch (err: Error | UserError | any) {
            console.log(err);
            throw err;
        }
    }

    /**
     * Delete an existing user in the database
     * @returns User | Error
     */
    async delete() {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndDelete(this._id);
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async addMenu(menuId: string) {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, { $push: { menuList: menuId } }, { new: true });
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async removeMenu(menuId: string) {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, { $pull: { menuList: menuId } }, { new: true });
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async addSuscription(suscription: ISuscription) {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, { suscription: suscription }, { new: true });
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async removeSuscription() {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, { suscription: null }, { new: true });
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async updateSuscription(suscription: ISuscription) {
        try {
            await db.connectDB();
            const user = await UserModel.findByIdAndUpdate(this._id, { suscription: suscription }, { new: true });
            return user;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    static fromJSON(data: IUser): User {
        return new User(data);
    }

    static async getAllUsers() {
        try {
            await db.connectDB();
            const users = await UserModel.find();
            return users;
        } catch (err) {
            throw Error(ERROR_MESSAGES[500]);
        }
    }

    static async getUserByEmail(email: string) {
        try {
            await db.connectDB();
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return null; // or handle the case when user is null
            }
            return new User(user);
        } catch (err: Error | UserError | any) {
            console.error(err);
            throw err instanceof UserError ? new UserError(err) : new Error(ERROR_MESSAGES[500]);
        }
    }

    static async getUserById(id: string) {
        try {
            await db.connectDB();
            const user = await UserModel.findById(id);
            if (!user) {
                return null; // or handle the case when user is null
            }
            return new User(user);
        } catch (err: Error | UserError | any) {
            console.error(err);
            throw err instanceof UserError ? new UserError(err) : new Error(ERROR_MESSAGES[500]);
        }
    }
}