interface IProduct {
    _id: string;
    name: string;
    price: number | string;
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

interface IModalMessage {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "waiting";
    acceptAction?: () => void;
    cancelAction?: () => void;
}

export type { IProduct, ICategory, ISelectedItem, IModalMessage };