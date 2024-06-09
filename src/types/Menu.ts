import type { ObjectId } from "mongoose";

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
}

export type { IMenu, ICategories, IProduct };