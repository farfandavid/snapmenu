import type { ProjectionFields, Types } from "mongoose";
import db from "../config/db";
import { CategoriesError, CategoriesSchema, MenuError, MenuSchema, ProductError, ProductSchema, type ICategories, type IMenu, type IProduct } from "../interface/Menu";
import { MenuModel } from "../models/menuModel";
import { ERROR_MESSAGES } from "../utils/constants";

export class Product implements IProduct {
    _id: string;
    name: string;
    description?: string;
    url_image?: string;
    price?: number;
    quantity?: number;
    active: boolean;

    constructor(data: IProduct) {
        this._id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.url_image = data.url_image;
        this.price = data.price;
        this.quantity = data.quantity;
        this.active = data.active;
    }

    validate(): Product | ProductError {
        const validate = ProductSchema.safeParse(this);
        if (!validate.success) {
            throw new ProductError(validate.error?.flatten().fieldErrors)
        } else {
            return validate.data as Product;
        }
    }

    async save(menuId: string, categoryId: string) {
        this.validate();
        await db.connectDB();
        const menu = await MenuModel.findOneAndUpdate({ _id: menuId, "categories._id": categoryId }, { $push: { "categories.$.products": this } }, { new: true, runValidators: true });
        if (!menu) {
            // Verificamos si el menú existe o si el producto está duplicado
            const menuExists = await MenuModel.findById(menuId);
            if (!menuExists) {
                throw new ProductError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
            }
            // Si el menú existe, significa que el producto está duplicado
            throw new ProductError({ _id: [ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS] });
        }

        return new Product(this);
    }

    async update(menuId: string, categoryId: string, fields?: ProjectionFields<Product>) {
        await db.connectDB();
        const updateFields: { [key: string]: any } = {};
        if (fields) {
            Object.keys(fields).forEach(field => {
                updateFields[`categories.$[category].products.$[product].${field}`] = (this as any)[field];
            });
        } else {
            // Si no hay fields específicos, actualizamos todo el producto
            updateFields["categories.$[category].products.$[product]"] = this;
        }
        const menu = await MenuModel.findOneAndUpdate(
            { _id: menuId, "categories._id": categoryId },
            { $set: updateFields },
            { new: true, runValidators: true, arrayFilters: [{ "category._id": categoryId }, { "product._id": this._id }] }
        );
        if (!menu) {
            throw new ProductError({ _id: [ERROR_MESSAGES.PRODUCT_NOT_UPDATED] });
        }
        return new Product(this);
    }

    async delete(menuId: string, categoryId: string) {
        await db.connectDB();
        const menu = await MenuModel.findOneAndUpdate({ _id: menuId, "categories._id": categoryId }, { $pull: { "categories.$.products": { _id: this._id } } }, { new: true });
        if (!menu) {
            throw new ProductError({ _id: [ERROR_MESSAGES.PRODUCT_NOT_DELETED] });
        }
        return new Product(this);
    }

    static fromJSON(data: IProduct) {
        return new Product(data);
    }

    static fromFormData(data: FormData) {
        return new Product({
            _id: data.get('_id') as string,
            name: data.get('name') as string,
            description: data.get('description') as string,
            url_image: data.get('url_image') as string,
            price: Number(data.get('price')),
            quantity: Number(data.get('quantity')),
            active: data.get('active') === 'true',
        });
    }

    static async updateManyProducts(menuId: string, categoryId: string, products: IProduct[]) {
        await db.connectDB();

        const menu = await MenuModel.findOneAndUpdate(
            { _id: menuId, "categories._id": categoryId },
            { $set: { "categories.$.products": products } },
            { new: true, runValidators: true }
        );
        if (!menu) {
            throw new ProductError({ _id: [ERROR_MESSAGES.PRODUCT_NOT_UPDATED] });
        }
        return products.map(product => new Product(product));
    }

    static async getProductById(menuId: string, categoryId: string, productId: string, fields?: ProjectionFields<Product>) {
        await db.connectDB();
        const menu = await MenuModel.findOne({ _id: menuId, "categories._id": categoryId, "categories.products._id": productId }, fields);
        if (!menu) {
            throw new ProductError({ _id: [ERROR_MESSAGES.PRODUCT_NOT_FOUND] });
        }
        if (!menu.categories) {
            throw new ProductError({ _id: [ERROR_MESSAGES.CATEGORY_NOT_FOUND] });
        }
        const category = menu.categories.find(category => category._id === categoryId);
        if (!category?.products) {
            throw new ProductError({ _id: [ERROR_MESSAGES.CATEGORY_NOT_FOUND] });
        }
        const product = category.products.find(product => product._id === productId);
        return new Product({
            _id: product?._id || '',
            name: product?.name || '',
            description: product?.description,
            active: product?.active || true,
            price: product?.price,
            quantity: product?.quantity,
            url_image: product?.url_image,
        });
    }
}

export class Category implements ICategories {
    _id: string;
    name: string;
    description?: string;
    active: boolean;
    products?: any[];

    constructor(data: ICategories) {
        this._id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.active = data.active;
        this.products = data.products;
    }

    validate(fields?: Partial<Record<keyof ICategories, true>>): Category | CategoriesError {
        const myschema = fields ? CategoriesSchema.pick(fields) : CategoriesSchema;
        const validate = myschema.safeParse(this);
        if (!validate.success) {
            throw new CategoriesError(validate.error?.flatten().fieldErrors)
        } else {
            return validate.data as Category;
        }
    }

    async save(menuId: string) {
        this.validate();
        await db.connectDB();
        const menu = await MenuModel.findOneAndUpdate({ _id: menuId, "categories._id": { $ne: this._id } }, { $push: { categories: this } }, { new: true, runValidators: true });
        if (!menu) {
            // Verificamos si el menú existe o si la categoría está duplicada
            const menuExists = await MenuModel.findById(menuId);
            if (!menuExists) {
                throw new CategoriesError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
            }
            // Si el menú existe, significa que la categoría está duplicada
            throw new CategoriesError({ _id: [ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS] });
        }

        return new Category(this);
    }

    async update(menuId: string, fields?: ProjectionFields<Category>) {
        await db.connectDB();
        const updateFields: { [key: string]: any } = {};
        if (fields) {
            Object.keys(fields).forEach(field => {
                updateFields[`categories.$.${field}`] = (this as any)[field];
            });
        } else {
            // Si no hay fields específicos, actualizamos toda la categoría
            updateFields["categories.$"] = this;
        }
        const menu = await MenuModel.findOneAndUpdate(
            { _id: menuId, "categories._id": this._id },
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        if (!menu) {
            throw new CategoriesError({ _id: [ERROR_MESSAGES.CATEGORY_NOT_FOUND] });
        }
        return new Category(this);
    }

    async delete(menuId: string) {
        await db.connectDB();
        const menu = await MenuModel.findOneAndUpdate({ _id: menuId, "categories._id": this._id }, { $pull: { categories: { _id: this._id } } }, { new: true });
        if (!menu) {
            throw new CategoriesError({ _id: [ERROR_MESSAGES.CATEGORY_NOT_DELETED] });
        }
        return new Category(this);
    }

    static fromJSON(data: ICategories) {
        return new Category(data);
    }

    static fromFormData(data: FormData) {
        return new Category({
            _id: data.get('_id') as string,
            name: data.get('name') as string,
            description: data.get('description') as string,
            active: data.get('active') === 'true',
            products: JSON.parse(data.get('products') as string),
        });
    }

    static async updateManyCategories(menuId: string, categories: ICategories[]) {
        await db.connectDB();
        const menu = await MenuModel.findByIdAndUpdate(menuId, { categories }, { new: true, runValidators: true });
        if (!menu) {
            throw new CategoriesError({ _id: [ERROR_MESSAGES.CATEGORY_NOT_UPDATED] });
        }
        return categories.map(category => new Category(category));
    }
}

export class Menu implements IMenu {
    _id?: Types.ObjectId;
    name: string;
    userId: string;
    expDate: Date;
    maxProducts: number;
    active: boolean;
    description?: string;
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
    schedules?: {}[];


    constructor(data: IMenu) {
        this._id = data._id;
        this.name = data.name;
        this.userId = data.userId;
        this.description = data.description;
        this.active = data.active;
        this.categories = data.categories;
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
        this.schedules = data.schedules;
        this.expDate = data.expDate;
        this.maxProducts = data.maxProducts ?? 100;
    }

    validate(): Menu | MenuError {
        const validate = MenuSchema.safeParse(this);
        if (!validate.success) {
            throw new MenuError(validate.error?.flatten().fieldErrors)
        } else {
            return validate.data as Menu;
        }
    }

    async save() {
        await db.connectDB();
        const isExist = await MenuModel.findOne({ name: this.name }, { _id: 1, name: 1 });
        if (isExist) {
            throw new MenuError({ name: [ERROR_MESSAGES.MENU_ALREADY_EXISTS] });
        }
        const menu = new MenuModel(this);
        console.log(isExist);
        await menu.save();
        return new Menu(menu);
    }

    async update() {
        await db.connectDB();
        const menu = await MenuModel.findByIdAndUpdate(this._id, this, { new: true });
        if (!menu) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return new Menu(menu);
    }

    async delete() {
        await db.connectDB();
        const menu = await MenuModel.findByIdAndDelete(this._id);
        if (!menu) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_DELETED] });
        }
        return new Menu(menu);
    }

    static fromJSON(data: IMenu) {
        return new Menu(data);
    }

    static fromFormData(data: FormData) {
        return new Menu({
            name: data.get('name') as string,
            userId: data.get('userId') as string,
            expDate: new Date(data.get('expDate') as string),
            maxProducts: Number(data.get('maxProducts')),
            active: data.get('active') === 'true',
            description: data.get('description') as string,
            categories: JSON.parse(data.get('categories') as string),
            address: data.get('address') as string,
            city: data.get('city') as string,
            state: data.get('state') as string,
            postalCode: data.get('postalCode') as string,
            country: data.get('country') as string,
            mapUrl: data.get('mapUrl') as string,
            phone: data.get('phone') as string,
            logoUrl: data.get('logoUrl') as string,
            bannerUrl: data.get('bannerUrl') as string,
            social: JSON.parse(data.get('social') as string),
            schedules: JSON.parse(data.get('schedules') as string),
        });
    }

    static async getMenuById(menuId: string, fields?: ProjectionFields<Menu>) {
        await db.connectDB();
        const menu = await MenuModel.findById(menuId, fields);
        if (!menu) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return new Menu(menu);
    }

    static async getMenuByName(name: string, fields?: ProjectionFields<Menu>) {
        await db.connectDB();
        const menu = await MenuModel.findOne({ name }, fields);
        if (!menu) {
            throw new MenuError({ name: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return new Menu(menu);
    }

    static async getMenuByIdAndUserId(menuId: string, userId: string, fields?: ProjectionFields<Menu>) {
        await db.connectDB();
        const menu = await MenuModel.findOne({ _id: menuId, userId }, fields);
        if (!menu) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return new Menu(menu);
    }

    static async getMenusByUserId(userId: string, fields?: ProjectionFields<Menu>) {
        await db.connectDB();
        //return MenuModel.find({ userId }, fields);
        const menus = await MenuModel.find({ userId }, fields);
        if (!menus) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return menus.map(menu => new Menu(menu));
    }

    static async getMenus(fields?: ProjectionFields<Menu>) {
        await db.connectDB();
        //return MenuModel.find({}, fields);
        const menus = await MenuModel.find({}, fields);
        if (!menus) {
            throw new MenuError({ _id: [ERROR_MESSAGES.MENU_NOT_FOUND] });
        }
        return menus.map(menu => new Menu(menu));
    }
}