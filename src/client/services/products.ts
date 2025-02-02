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