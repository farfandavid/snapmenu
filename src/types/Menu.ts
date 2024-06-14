import type { ObjectId } from "mongoose";

interface ISocial {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

interface IHorario {
    dia: number;
    apertura: string;
    cierre: string;
    timezone: string;
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
    active: boolean;
    categories?: ICategories[];
    error?: string;
    horarios?: IHorario[];
    address?: string;
    phone?: string;
    logoUrl?: string;
    bannerUrl?: string;
    social?: ISocial;
}

export type { IMenu, ICategories, IProduct };