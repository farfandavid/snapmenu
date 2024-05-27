import type { ObjectId } from "mongoose";

interface Product {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    active: boolean;
}

interface Categories {
    _id: ObjectId;
    name: string;
    description: string;
    active: boolean;
    products?: Product[];
}

interface Menu {
    _id: ObjectId;
    name: string;
    user: string;
    description: string;
    active: boolean;
    categories?: Categories[];
}

export type { Menu, Categories, Product };