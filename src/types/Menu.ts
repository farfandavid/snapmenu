import type { ObjectId } from "mongoose";

interface ISocial {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

interface IHorario {
    open: string;
    close: string;
}

interface IProduct {
    _id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    active: boolean;
}

interface ICategories {
    _id?: string;
    name: string;
    description: string;
    active: boolean;
    products?: IProduct[];
}

interface IMenu {
    _id?: ObjectId;
    name: string;
    userEmail: string;
    description: string;
    active?: boolean;
    categories?: ICategories[];
    error?: string;
    address?: string;
    mapUrl?: string;
    phone?: string;
    logoUrl?: string;
    bannerUrl?: string;
    social?: ISocial;
    openingHours?: [IHorario];
    expDate?: Date;
}

export type { IMenu, ICategories, IProduct };