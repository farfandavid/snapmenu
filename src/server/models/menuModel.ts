import type { IMenu, ICategories, IProduct, ISchedules } from "../interface/Menu";
import mongoose, { Model, Schema } from "mongoose";

interface IMenuModel extends IMenu, Document { }
interface ICategoryModel extends ICategories, Document { }
interface IProductModel extends IProduct, Document { }
interface ISchedulesModel extends ISchedules, Document { }

const HoursSchemaMongoose = new Schema<ISchedulesModel>({
    day: {
        type: String,
        required: true,
    },
    openclose: {
        type: [{
            opening: {
                type: String,
                required: true,
            },
            closing: {
                type: String,
                required: true,
            }
        }],
        required: false,
    },
}, {
    timestamps: false,
    _id: false,
})

const ProductSchemaMongoose = new Schema<IProductModel>({
    _id: {
        type: String,
        required: true,
        unique: false,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    url_image: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    }
})

const CategoriesSchemaMongoose = new Schema<ICategoryModel>({
    _id: {
        type: String,
        required: true,
        unique: false,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    },
    products: {
        type: [ProductSchemaMongoose],
        required: false,
    }
})

const MenuSchemaMongoose = new Schema<IMenuModel>({
    name: {
        type: String,
        required: true,
    },
    urlMenu: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    },
    categories: {
        type: [CategoriesSchemaMongoose],
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    postalCode: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false
    },
    map: {
        type: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            }
        },
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    logoUrl: {
        type: String,
        required: false,
    },
    bannerUrl: {
        type: String,
        required: false,
    },
    social: {
        facebook: {
            type: String,
            required: false,
        },
        instagram: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        }
    },
    schedules: {
        type: [HoursSchemaMongoose],
        required: false,
    },
    expDate: {
        type: Date,
        required: true,
    },
    maxProducts: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
    _id: true,
})

export const MenuModel: Model<IMenuModel> = mongoose.model<IMenuModel>('Menu', MenuSchemaMongoose);