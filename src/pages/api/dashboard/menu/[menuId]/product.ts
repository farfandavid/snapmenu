import type { APIRoute } from "astro";
import { ERROR_MESSAGES } from "../../../../../server/utils/constants";
import { Product } from "../../../../../server/class/Menu";
import { ProductError } from "../../../../../server/interface/Menu";

export const POST: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const { menuId } = params;
        const { category, product } = await request.json();
        if (!menuId || !category || !product) {
            return new Response(ERROR_MESSAGES[400], { status: 400 });
        }
        const newProduct = new Product(product);
        newProduct.validate();
        console.log("POST /api/dashboard/menu/[menuId]/product", newProduct);
        await newProduct.save(menuId, category._id);
        return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
        if (error instanceof ProductError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }

};

export const PUT: APIRoute = async ({ params, request, redirect, locals }) => {
    const data = await request.json();
    console.log("PUT /api/dashboard/menu/[menuId]/product", data);
    return new Response("PUT /api/dashboard/menu/[menuId]/product");
};

export const DELETE: APIRoute = async ({ params, request, redirect, locals }) => {
    const data = await request.json();
    console.log("DELETE /api/dashboard/menu/[menuId]/product", data);
    return new Response("DELETE /api/dashboard/menu/[menuId]/product");
}