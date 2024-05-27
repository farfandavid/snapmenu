import type { ObjectId } from "mongoose";

interface IProduct {
    _id?: ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    active: boolean;
}

interface ICategories {
    _id?: ObjectId;
    name: string;
    description: string;
    active: boolean;
    products?: IProduct[];
}

interface IMenu {
    _id?: ObjectId;
    name: string;
    user: string;
    description: string;
    active: boolean;
    categories?: ICategories[];
}

export type { IMenu, ICategories, IProduct };