import type { Types } from "mongoose";
import { MenuError, MenuSchema, type ICategories, type IMenu } from "../interface/Menu";
import db from "../config/db";
import { MenuModel } from "../models/menuModel";
import { ERROR_MESSAGES } from "../utils/constants";

export class Menu implements IMenu {
    _id?: Types.ObjectId;
    name: string;
    userEmail: string;
    description?: string;
    active: boolean;
    categories?: ICategories[];
    productsLimit?: number;
    address?: string;
    mapUrl?: string;
    phone?: string;
    logoUrl?: string;
    bannerUrl?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    openingHours?: {
        openH?: string;
        closeH?: string;
    }[];
    expDate?: Date;

    constructor(data: IMenu) {
        const validate = MenuSchema.safeParse(data);
        if (!validate.success) {
            throw new MenuError(validate.error?.flatten().fieldErrors)
        }
        this._id = data._id;
        this.name = data.name;
        this.userEmail = data.userEmail;
        this.description = data.description;
        this.active = data.active;
        this.categories = data.categories;
        this.productsLimit = data.productsLimit;
        this.address = data.address;
        this.mapUrl = data.mapUrl;
        this.phone = data.phone;
        this.logoUrl = data.logoUrl;
        this.bannerUrl = data.bannerUrl;
        this.social = data.social;
        this.openingHours = data.openingHours;
        this.expDate = data.expDate;
    }

    validate(): Menu | MenuError {
        const validate = MenuSchema.safeParse(this);
        if (!validate.success) {
            throw new MenuError(validate.error?.flatten().fieldErrors)
        } else {
            return validate.data as Menu;
        }
    }
    /**
     * Save a new menu in the database
     * @returns Menu | Error
     */
    async save() {
        try {
            await db.connectDB();
            const menu = new MenuModel(this);
            await menu.save();
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }
    /**
     * Update an existing menu in the database
     * @returns Menu | Error | MenuError | null
     */
    async update() {
        try {
            if (this.validate() instanceof MenuError) {
                throw this.validate();
            }
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, this, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err: Error | MenuError | any) {
            console.log(err);
            throw err;
        }
    }
    /**
     * Delete an existing menu in the database
     * @returns Menu | Error
     */
    async delete() {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndDelete(this._id);
            return menu;
        } catch (err) {
            console.log(err);
            return new Error(ERROR_MESSAGES[500]);
        }
    }

    async updateLogo(logoUrl: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, { logoUrl: logoUrl }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async addCategory(category: ICategories) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, { $push: { categories: category } }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async removeCategory(category: ICategories) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate
                (this._id, { $pull: { categories: category } }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async updateCategory(category: ICategories) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findOneAndUpdate
                ({ _id: this._id, "categories._id": category._id }, { $set: { "categories.$": category } }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async updateInfo(menuData: IMenu) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, {
                $set: {
                    name: menuData.name,
                    description: menuData.description,
                    categories: menuData.categories,
                    address: menuData.address,
                    mapUrl: menuData.mapUrl,
                    phone: menuData.phone,
                    bannerUrl: menuData.bannerUrl,
                    social: menuData.social,
                }
            }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async updateOpeningHours(openingHours: {
        openH: string;
        closeH: string;
    }[]) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, { openingHours: openingHours }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    async addExpDate(expDate: Date) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, { expDate: expDate }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    static async getAllMenus() {
        try {
            await db.connectDB();
            const menus = await MenuModel.find();
            return menus;
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    static async getMenuByName(name: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findOne({
                name: name
            });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    static async getMenusByUserEmail(userEmail: string) {
        try {
            await db.connectDB();
            const menus = await MenuModel.find({
                userEmail: userEmail
            });
            if (!menus) return null;
            return new Array<Menu>(...menus.map(menu => new Menu(menu)));
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }

    static async getMenuByNameAndUserEmail(name: string, userEmail: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findOne({
                name: name,
                userEmail: userEmail
            });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }
}