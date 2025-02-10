import { z } from "astro/zod";
import { Types } from "mongoose";


const MIN_MENU_NAME_LENGTH = 4;
const MAX_MENU_NAME_LENGTH = 50;

const MAX_LENGTH_DESCRIPTION = 250;
const MAX_LENGTH_NAME = 150;
const MAX_LENGTH_URL = 512;
const MAX_NUMBER = 99999999999;

const maxDecimalPlaces = (value: number, max: number) => {
    const decimalPart = value.toString().split(".")[1];
    return !decimalPart || decimalPart.length <= max;
}

const opencloseSchema = z.object({
    opening: z.string().max(6).optional(),
    closing: z.string().max(6).optional(),
});

const schedulesSchema = z.object({
    openclose: z.array(opencloseSchema).optional(),
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).optional(),
});

type ISchedules = z.infer<typeof schedulesSchema>;

const ProductSchema = z.object({
    _id: z.string().uuid(),
    name: z.string().max(MAX_LENGTH_NAME),
    description: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    url_image: z.string().max(MAX_LENGTH_URL).optional(),
    price: z.number().max(MAX_NUMBER).refine(
        value => maxDecimalPlaces(value, 2),
        {
            message: "El precio no puede tener más de dos decimales",
        }
    ).optional(),
    quantity: z.number().max(MAX_NUMBER).optional(),
    active: z.boolean(),
});

type IProduct = z.infer<typeof ProductSchema>;

const CategoriesSchema = z.object({
    _id: z.string().uuid(),
    name: z.string().max(MAX_LENGTH_NAME),
    description: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    active: z.boolean(),
    products: z.array(ProductSchema).optional(),
});

type ICategories = z.infer<typeof CategoriesSchema>;

const MenuSchema = z.object({
    _id: z.instanceof(Types.ObjectId).optional(),
    name: z.string().min(MIN_MENU_NAME_LENGTH).max(MAX_MENU_NAME_LENGTH).regex(/^[a-zA-Z0-9]+$/, { message: "Solo se permiten letras y números" }),
    userId: z.string(),
    description: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    active: z.boolean(),
    categories: z.array(CategoriesSchema).max(25, {
        message: "No se pueden agregar más de 25 categorías",
    }).optional(),
    address: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    city: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    state: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    postalCode: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    country: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    map: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
    }).optional(),
    phone: z.string().max(MAX_LENGTH_DESCRIPTION).optional(),
    logoUrl: z.string().max(MAX_LENGTH_URL).optional(),
    bannerUrl: z.string().max(MAX_LENGTH_URL).optional(),
    social: z.object({
        facebook: z.string().max(MAX_LENGTH_URL).optional(),
        instagram: z.string().max(MAX_LENGTH_URL).optional(),
        twitter: z.string().max(MAX_LENGTH_URL).optional(),
    }).optional(),
    schedules: z.array(schedulesSchema).optional(),
    expDate: z.date(),
    maxProducts: z.number().default(100).optional(),
});

type IMenu = z.infer<typeof MenuSchema>;

// Error handling

export interface IProductErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    description?: string[] | undefined;
    url_image?: string[] | undefined;
    price?: string[] | undefined;
    quantity?: string[] | undefined;
    active?: string[] | undefined;
}

export class ProductError implements IProductErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    description?: string[] | undefined;
    url_image?: string[] | undefined;
    price?: string[] | undefined;
    quantity?: string[] | undefined;
    active?: string[] | undefined;

    constructor(error: IProductErrors) {
        this._id = error._id;
        this.name = error.name;
        this.description = error.description;
        this.url_image = error.url_image;
        this.price = error.price;
        this.quantity = error.quantity;
        this.active = error.active;
    }
}

export interface ICategoriesErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    products?: string[] | undefined;
}

export class CategoriesError implements ICategoriesErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    products?: string[] | undefined;

    constructor(error: ICategoriesErrors) {
        this._id = error._id;
        this.name = error.name;
        this.description = error.description;
        this.active = error.active;
        this.products = error.products;
    }
}

export interface IMenuErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    userId?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    categories?: string[] | undefined;
    address?: string[] | undefined;
    map?: string[] | undefined;
    phone?: string[] | undefined;
    logoUrl?: string[] | undefined;
    bannerUrl?: string[] | undefined;
    social?: string[] | undefined;
    schedules?: string[] | undefined;
    expDate?: string[] | undefined;
}

export class MenuError implements IMenuErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    userId?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    categories?: string[] | undefined;
    address?: string[] | undefined;
    city?: string[] | undefined;
    state?: string[] | undefined;
    postalCode?: string[] | undefined;
    country?: string[] | undefined;
    map?: string[] | undefined;
    phone?: string[] | undefined;
    logoUrl?: string[] | undefined;
    bannerUrl?: string[] | undefined;
    social?: string[] | undefined;
    schedules?: string[] | undefined;
    expDate?: string[] | undefined;

    constructor(error: IMenuErrors) {
        this._id = error._id;
        this.name = error.name;
        this.userId = error.userId;
        this.description = error.description;
        this.active = error.active;
        this.categories = error.categories;
        this.address = error.address;
        this.map = error.map;
        this.phone = error.phone;
        this.logoUrl = error.logoUrl;
        this.bannerUrl = error.bannerUrl;
        this.social = error.social;
        this.schedules = error.schedules;
        this.expDate = error.expDate;
    }
}

export { MenuSchema, CategoriesSchema, ProductSchema };
export type { IMenu, ICategories, IProduct, ISchedules };