import mongoose from 'mongoose';
import Menu from '../models/menuModel'; // Importa tus modelos de Mongoose aquí
import type { IMenu } from '../types/Menu';
import db from '../db/db';

// Funciones CRUD para la colección de menú
export const createMenu = async (menuData: IMenu) => {
    try {
        db.connectDB();
        const menu = await Menu.create({ _id: new mongoose.Types.ObjectId(), ...menuData });
        await menu.save();
        return menu;
    } catch (error: any) {
        throw new Error('Error al crear el menú el nombre ya esta en uso', error);
    }
};

export const getMenuByIdAndUserEmail = async (id: string, email: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findOne({ _id: id, userEmail: email });
        return menu;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getMenusByUserEmail = async (userEmail: string) => {
    try {
        db.connectDB();
        const menus = await Menu.find({ userEmail: userEmail });
        return menus;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getMenuByName = async (name: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findOne({ name: name });
        return menu;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

export const getAllMenus = async () => {
    try {
        db.connectDB();
        const menu = await Menu.find();
        return menu;
    } catch (error) {
        throw new Error('Error al obtener el menú');
    }
}

export const updateMenuById = async (id: string, menuData: any, userEmail: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findOneAndUpdate({ _id: id, userEmail: userEmail }, menuData, { new: true });
        return menu;
    } catch (error) {
        throw new Error('Error al actualizar el menú');
    }
};

export const deleteMenu = async (id: string) => {
    try {
        db.connectDB();
        await Menu.findByIdAndDelete(id);
        return 'Menú eliminado correctamente';
    } catch (error) {
        throw new Error('Error al eliminar el menú');
    }
};

// Funciones CRUD para la colección de categorías
export const createCategory = async (menuId: string, categoryData: any) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        menu.categories.push(categoryData);
        await menu.save();
    } catch (error) {
        throw new Error('Error al crear la categoría');
    }
};

export const getAllCategoriesByMenuId = async (menuId: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        return menu.categories;
    } catch (error) {
        throw new Error('Error al obtener las categorías');
    }
};

export const updateCategory = async (menuId: string, categoryId: string, categoryData: any) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories._id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
        Object.assign(category, categoryData);
        //category.set(categoryData);
        await menu.save();
        return category;
    } catch (error) {
        throw new Error('Error al actualizar la categoría');
    }
};

export const updateCategories = async (userEmail: string, menuId: string, categoriesData: any) => {
    try {
        db.connectDB();
        const menu = await Menu.findOneAndUpdate({ _id: menuId, userEmail: userEmail }, { categories: categoriesData }, { new: true });
        //const menu = await Menu.findById(menuId, 'categories');
        if (!menu) {
            throw new Error('El menú no existe');
        }
        menu.categories = categoriesData;
        await menu.save();
        return menu;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteCategoryById = async (menuId: string, categoryId: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        menu.categories.id(categoryId).remove();
        await menu.save();
    } catch (error) {
        throw new Error('Error al eliminar la categoría');
    }
};

// Funciones CRUD para la colección de productos
export const createProduct = async (menuId: string, categoryId: string, productData: any) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories.id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
        category.products.push(productData);
        await menu.save();
        return productData;
    } catch (error) {
        throw new Error('Error al crear el producto');
    }
};

export const getAllProductsByCategoryId = async (menuId: string, categoryId: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories.id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
        return category.products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}

/* export const getProduct = async (menuId: string, categoryId: string) => {
    try {
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories.id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}; */

export const updateProductById = async (menuId: string, categoryId: string, productId: string, productData: any) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories.id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
        const product = category.products.id(productId);
        if (!product) {
            throw new Error('El producto no existe');
        }
        Object.assign(product, productData);
        await menu.save();
        return product;
    } catch (error) {
        throw new Error('Error al actualizar el producto');
    }
};

export const deleteProduct = async (menuId: string, categoryId: string, productId: string) => {
    try {
        db.connectDB();
        const menu = await Menu.findById(menuId);
        if (!menu) {
            throw new Error('El menú no existe');
        }
        const category = menu.categories.id(categoryId);
        if (!category) {
            throw new Error('La categoría no existe');
        }
        category.products.id(productId).remove();
        await menu.save();
        return 'Producto eliminado correctamente';
    } catch (error) {
        throw new Error('Error al eliminar el producto');
    }
};