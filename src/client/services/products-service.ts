import type { ICategory, ISelectedItem } from "../types/Interfaces";

export const addCategory = async (menuId: string, data: FormData) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/category`, {
        method: "POST",
        body: data,
    });
    if (!response.ok) {
        throw new Error("Error al agregar la categoría");
    }
    return response;
}

export const deleteCategory = async (menuId: string, categoryId: string) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/category`, {
        method: "DELETE",
        body: JSON.stringify({ categoryId }),
    });
    if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
    }
    return response;
}

export const updateCategory = async (menuId: string, data: FormData) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/category`, {
        method: "PUT",
        body: data,
    });
    if (!response.ok) {
        throw new Error("Error al actualizar la categoría");
    }
    return response;
}

export const saveAllCategories = async (menuId: string, categories: ICategory[]) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/categories`, {
        method: "PUT",
        body: JSON.stringify({ categories }),
    });
    if (!response.ok) {
        throw new Error("Error al guardar las categorías");
    }
    return response;
}

export const addProduct = async (menuId: string, data: ISelectedItem) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/product`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Error al agregar el producto");
    }
    return response;
}

export const updateProduct = async (menuId: string, data: ISelectedItem) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/product`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Error al actualizar el producto");
    }
    return response;
}

export const deleteProduct = async (menuId: string, productId: string, categoryId: string) => {
    const response = await fetch(`/api/dashboard/menu/${menuId}/product`, {
        method: "DELETE",
        body: JSON.stringify({ productId, categoryId }),
    });
    if (!response.ok) {
        throw new Error("Error al eliminar el producto");
    }
    return response;
}