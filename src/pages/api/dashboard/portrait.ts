import type { APIRoute } from "astro";
import { putObject } from "../../../server/config/s3";
import { CDN_URL } from "../../../client/utils/constant";
import { Menu } from "../../../server/class/Menu";

export const POST: APIRoute = async ({ request, locals }) => {
    const formData = await request.formData();
    const menuId = formData.get("menu") as string;
    const image = formData.get("portrait") as File;
    console.log(formData)
    if (!image) {
        return new Response(JSON.stringify({ error: "No se ha proporcionado una imagen" }), { status: 400 });
    }
    // Si la imagen es mayor a 2MB
    if (image.size > 1024 * 1024 * 3) {
        return new Response(JSON.stringify({ error: "La imagen es muy pesada" }), { status: 400 });
    }
    if (typeof menuId !== "string") {
        return new Response(JSON.stringify({ error: "No se ha proporcionado un menú" }), { status: 400 });
    }
    if (typeof image !== "object") {
        return new Response(JSON.stringify({ error: "No se ha proporcionado una imagen" }), { status: 400 });
    }
    // extensiones permitidas
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    // Si la imagen no es un formato de imagen
    if (!image.type.startsWith("image/") || !allowedExtensions.includes(image.type.split("/").pop() || "")) {
        return new Response(JSON.stringify({ error: "El archivo no es una imagen" }), { status: 400 });
    }
    const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "");
    if (!menu) {
        return new Response(JSON.stringify({ error: "Menú no encontrado" }), { status: 404 });
    }
    // Subir imagen
    //const extension = image.type.split("/").pop();
    const data = await putObject(`portrait/${menu.name}`, Buffer.from(await image.arrayBuffer()), image.type);
    if (!data) {
        return new Response(JSON.stringify({ error: "No se ha podido subir la imagen" }), { status: 500 });
    }
    // Actualizar logoUrl
    const updated = await menu.updateBanner(`${CDN_URL}portrait/${menu.name}`);
    if (!updated) {
        return new Response(JSON.stringify({ error: "No se ha podido actualizar el menú" }), { status: 500 });
    }
    console.log(locals.user.email + ";" + updated.bannerUrl)
    return new Response(JSON.stringify({ success: true, logoUrl: updated.bannerUrl }), { status: 200 });

}

export const GET: APIRoute = async ({ request, locals }) => {
    console.log(locals.user)
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
} 