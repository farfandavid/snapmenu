interface IProduct {
    _id: string;
    name: string;
    price: number;
    description?: string;
    url_image?: string;
    active: boolean;
    quantity: number;
}

interface ICategory {
    _id: string;
    name: string;
    description?: string;
    products?: IProduct[];
    active: boolean;
}

interface ISelectedItem {
    category?: ICategory;
    product?: IProduct;
    menuId?: string;
}

export type { IProduct, ICategory, ISelectedItem };