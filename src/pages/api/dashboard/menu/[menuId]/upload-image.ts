import type { APIRoute } from "astro";
import { putObject } from "../../../../../server/config/s3";
import { CDN_URL } from "../../../../../client/utils/constant";
import { Menu } from "../../../../../server/class/Menu";


export const POST: APIRoute = async ({ request, params, locals }) => {
    const formData = await request.formData();
    const { menuId } = params;
    const image = formData.get("image") as File;
    if (image.name === "logo") {
        return new Response(JSON.stringify({ success: false, error: "No se ha podido subir la imagen", name: image.name }), { status: 500 });
    }
    if (typeof menuId !== "string") {
        return new Response(JSON.stringify({ success: false, error: "No se ha proporcionado un menú" }), { status: 400 });
    }
    // Si la imagen es mayor a 2MB
    if (image.size > 1024 * 1024 * 3) {
        return new Response(JSON.stringify({ success: false, error: "La imagen es muy pesada" }), { status: 400 });
    }
    if (typeof image !== "object") {
        return new Response(JSON.stringify({ success: false, error: "No se ha proporcionado una imagen" }), { status: 400 });
    }
    // extensiones permitidas
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    // Si la imagen no es un formato de imagen
    if (!image.type.startsWith("image/") || !allowedExtensions.includes(image.type.split("/").pop() || "")) {
        return new Response(JSON.stringify({ success: false, error: "El archivo no es una imagen", name: image.name }), { status: 400 });
    }

    const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "");
    if (!menu) {
        return new Response(JSON.stringify({ success: false, error: "Menú no encontrado", name: image.name }), { status: 404 });
    }

    // Subir imagen
    const data = await putObject(`${menu.userId}/${menuId}/${image.name}`, Buffer.from(await image.arrayBuffer()), image.type);
    if (!data) {
        return new Response(JSON.stringify({ success: false, error: "No se ha podido subir la imagen", name: image.name }), { status: 500 });
    }
    if (data.$metadata.httpStatusCode !== 200) {
        return new Response(JSON.stringify({ success: false, error: "No se ha podido subir la imagen", name: image.name }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, imageUrl: `${menu.userId}/${menuId}/${image.name}`, name: image.name }), { status: 200 });
}