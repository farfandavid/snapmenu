import type { APIRoute } from "astro";
import { Category } from "../../../../../server/class/Menu";
import { CategoriesError } from "../../../../../server/interface/Menu";
import { ERROR_MESSAGES } from "../../../../../server/utils/constants";

export const PUT: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const data = await request.json();
        const { menuId } = params;
        if (!menuId) return new Response("No found", { status: 404 });
        const categories = await Category.updateManyCategories(menuId, data.categories);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        if (error instanceof CategoriesError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
        return new Response(ERROR_MESSAGES[500], {
            status:
                500
        });
    }

}