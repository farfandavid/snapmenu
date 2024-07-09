import { z } from "astro/zod";
import { Types } from "mongoose";

const SocialSchema = z.object({
    facebook: z.string().max(100).optional(),
    instagram: z.string().max(100).optional(),
    twitter: z.string().max(100).optional(),
});

type ISocial = z.infer<typeof SocialSchema>;

const openingHoursSchema = z.object({
    openH: z.string().max(10),
    closeH: z.string().max(10),
});

type IHours = z.infer<typeof openingHoursSchema>;

const ProductSchema = z.object({
    _id: z.string().uuid(),
    name: z.string().max(50),
    description: z.string().max(100).optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    active: z.boolean(),
});

type IProduct = z.infer<typeof ProductSchema>;

const CategoriesSchema = z.object({
    _id: z.string().uuid(),
    name: z.string().max(50),
    description: z.string().max(100).optional(),
    active: z.boolean(),
    products: z.array(ProductSchema).optional(),
});

type ICategories = z.infer<typeof CategoriesSchema>;

const MenuSchema = z.object({
    _id: z.instanceof(Types.ObjectId).optional(),
    name: z.string().max(30).regex(/^[a-zA-Z0-9]+$/, { message: "Solo se permiten letras y números" }),
    userEmail: z.string().email(),
    description: z.string().max(150).optional(),
    active: z.boolean(),
    categories: z.array(CategoriesSchema).optional(),
    //error: z.string().optional(),
    address: z.string().max(10).optional(),
    mapUrl: z.string().optional(),
    phone: z.string().max(20).optional(),
    logoUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    social: SocialSchema.optional(),
    openingHours: z.array(openingHoursSchema).optional(),
    expDate: z.date().optional(),
});

type IMenu = z.infer<typeof MenuSchema>;

export interface IMenuErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    userEmail?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    categories?: string[] | undefined;
    address?: string[] | undefined;
    mapUrl?: string[] | undefined;
    phone?: string[] | undefined;
    logoUrl?: string[] | undefined;
    bannerUrl?: string[] | undefined;
    social?: string[] | undefined;
    openingHours?: string[] | undefined;
    expDate?: string[] | undefined;
}

export class MenuError implements IMenuErrors {
    _id?: string[] | undefined;
    name?: string[] | undefined;
    userEmail?: string[] | undefined;
    description?: string[] | undefined;
    active?: string[] | undefined;
    categories?: string[] | undefined;
    address?: string[] | undefined;
    mapUrl?: string[] | undefined;
    phone?: string[] | undefined;
    logoUrl?: string[] | undefined;
    bannerUrl?: string[] | undefined;
    social?: string[] | undefined;
    openingHours?: string[] | undefined;
    expDate?: string[] | undefined;

    constructor(error: IMenuErrors) {
        this._id = error._id;
        this.name = error.name;
        this.userEmail = error.userEmail;
        this.description = error.description;
        this.active = error.active;
        this.categories = error.categories;
        this.address = error.address;
        this.mapUrl = error.mapUrl;
        this.phone = error.phone;
        this.logoUrl = error.logoUrl;
        this.bannerUrl = error.bannerUrl;
        this.social = error.social;
        this.openingHours = error.openingHours;
        this.expDate = error.expDate;
    }
}

export { MenuSchema, CategoriesSchema, ProductSchema };
export type { IMenu, ICategories, IProduct, ISocial, IHours };