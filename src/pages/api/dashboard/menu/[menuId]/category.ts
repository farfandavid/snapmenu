import type { APIRoute } from "astro";
import { Category } from "../../../../../server/class/Menu";
import { ERROR_MESSAGES } from "../../../../../server/utils/constants";
import { CategoriesError } from "../../../../../server/interface/Menu";

export const POST: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const { menuId } = params;
        if (!menuId) return new Response("No found", { status: 404 });
        const data = await request.formData();

        const category = Category.fromFormData(data);
        console.log(category);
        category.validate();
        await category.save(menuId);
        return new Response(JSON.stringify(category), { status: 201, headers: { 'content-type': 'application/json' } });

    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return new Response(ERROR_MESSAGES.CATEGORY_NOT_ADDED, { status: 400 });
        }
        if (error instanceof CategoriesError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }

        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }
}

export const DELETE: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const { menuId } = params;
        const data = await request.json();
        console.log(data.categoryId);
        if (!menuId || !data.categoryId) return new Response("Not found", { status: 404 });
        const category = new Category({
            _id: data.categoryId,
            name: "",
            description: "",
            active: false,
            products: [],
        });
        //if (!category) return new Response("No category found", { status: 404 });
        await category.delete(menuId);
        return new Response(JSON.stringify(category), { status: 200, headers: { 'content-type': 'application/json' } });

    } catch (error) {
        console.error(error);
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }
}