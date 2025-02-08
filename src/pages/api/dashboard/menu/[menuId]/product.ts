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
        const newProduct = new Product({ ...product, price: parseFloat(product.price) });
        newProduct.validate();
        await newProduct.save(menuId, category._id);
        return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
        console.log(error);
        if (error instanceof ProductError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }

};

export const PUT: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const { menuId } = params;
        const { category, product } = await request.json();
        if (!menuId || !category || !product) {
            return new Response(ERROR_MESSAGES[400], { status: 400 });
        }
        const updatedProduct = new Product({ ...product, price: parseFloat(product.price) });
        updatedProduct.validate();
        await updatedProduct.update(menuId, category._id);
        return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error) {
        console.log(error);
        if (error instanceof ProductError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ params, request, redirect, locals }) => {
    try {
        const { menuId } = params;
        const { categoryId, productId } = await request.json();
        if (!menuId || !categoryId || !productId) {
            return new Response(ERROR_MESSAGES[400], { status: 400 });
        }
        const product = await Product.getProductById(menuId, categoryId, productId);
        if (!product) {
            return new Response(ERROR_MESSAGES[404], { status: 404 });
        }
        await product.delete(menuId, categoryId);
        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        if (error instanceof ProductError) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }
}