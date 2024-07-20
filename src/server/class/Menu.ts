import type { Types } from "mongoose";
import { CategoriesError, CategoriesSchema, MenuError, MenuSchema, type ICategories, type IMenu } from "../interface/Menu";
import db from "../config/db";
import { MenuModel } from "../models/menuModel";
import { ERROR_MESSAGES } from "../utils/constants";

export class Menu implements IMenu {
    _id?: Types.ObjectId;
    name: string;
    userId: string;
    description?: string;
    active: boolean;
    categories?: ICategories[];
    productsLimit?: number;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
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
    expDate: Date;
    maxProducts: number;

    constructor(data: IMenu) {
        const validate = MenuSchema.safeParse(data);
        if (!validate.success) {
            throw new MenuError(validate.error?.flatten().fieldErrors)
        }
        this._id = data._id;
        this.name = data.name;
        this.userId = data.userId;
        this.description = data.description;
        this.active = data.active;
        this.categories = data.categories;
        this.productsLimit = data.productsLimit;
        this.address = data.address;
        this.city = data.city;
        this.state = data.state;
        this.postalCode = data.postalCode;
        this.country = data.country;
        this.mapUrl = data.mapUrl;
        this.phone = data.phone;
        this.logoUrl = data.logoUrl;
        this.bannerUrl = data.bannerUrl;
        this.social = data.social;
        this.openingHours = data.openingHours;
        this.expDate = data.expDate;
        this.maxProducts = data.maxProducts;

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

    async updateBanner(bannerUrl: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, { bannerUrl: bannerUrl }, { new: true });
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
    async updateCategories(categories: ICategories[]) {
        try {
            await db.connectDB();
            const validate = await MenuSchema.safeParseAsync({
                ...this,
                categories: categories
            });
            if (!validate.success) {
                throw new MenuError(validate.error?.flatten().fieldErrors);
            }
            const countProducts = categories.reduce((acc, curr) => acc + (curr.products?.length ?? 0), 0);
            if (countProducts > this.maxProducts) {
                throw new CategoriesError({ products: ["Exceeded the maximum number of products"] });
            }
            const menu = await MenuModel.findByIdAndUpdate(this._id, { categories: categories }, { new: true });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {

            if (err instanceof MenuError) {
                throw new MenuError(err);
            }
            if (err instanceof CategoriesError) {
                throw new CategoriesError(err);
            }
            throw new Error(ERROR_MESSAGES[500]);
        }
    }
    async updateInfo() {
        try {
            await db.connectDB();
            const menu = await MenuModel.findByIdAndUpdate(this._id, {
                $set: {
                    description: this.description,
                    address: this.address,
                    mapUrl: this.mapUrl,
                    phone: this.phone,
                    social: this.social,
                    city: this.city,
                    state: this.state,
                    postalCode: this.postalCode,
                    country: this.country
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

    async setExpDate(expDate: Date) {
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
    static async getMenuById(id: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findById(id);
            if (!menu) return null;
            return new Menu(menu);
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
    /**
     * Get all menus by user id
     * @param userId 
     * @returns Menu[] | null
     * @throws Error
     */
    static async getMenusByUserId(userId: string) {
        try {
            await db.connectDB();
            const menus = await MenuModel.find({
                userId: userId
            });
            if (!menus) return null;
            return new Array<Menu>(...menus.map(menu => new Menu(menu)));
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }
    /**
     * Get a menu by id and user id
     * @param id 
     * @param userId 
     * @returns 
     */
    static async getMenuByIdAndUserId(id: string, userId: string) {
        try {
            await db.connectDB();
            const menu = await MenuModel.findOne({
                _id: id,
                userId: userId
            });
            if (!menu) return null;
            return new Menu(menu);
        } catch (err) {
            console.log(err);
            throw new Error(ERROR_MESSAGES[500]);
        }
    }
}