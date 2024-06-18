import type { APIRoute } from "astro";
import { putObject } from "../../db/s3";
import { getMenuByIdAndUserEmail, updateMenuLogo } from "../../controller/menuController";
import { CDN_URL } from "../../utils/constant";

export const POST: APIRoute = async ({ request, locals }) => {
    const formData = await request.formData();
    const menu = formData.get("menu") as string;
    const image = formData.get("image") as File;
    console.log(formData)
    if (!image) {
        return new Response(JSON.stringify({ error: "No se ha proporcionado una imagen" }), { status: 400 });
    }
    // Si la imagen es mayor a 2MB
    if (image.size > 1024 * 1024 * 2) {
        return new Response(JSON.stringify({ error: "La imagen es muy pesada" }), { status: 400 });
    }
    if (typeof menu !== "string") {
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

    const menudata = await getMenuByIdAndUserEmail(menu, locals.user.email || "");

    //Subir imagen
    //const extension = image.type.split("/").pop();
    const data = await putObject(`logos/${menudata.name}`, Buffer.from(await image.arrayBuffer()), image.type);
    if (!data) return new Response(JSON.stringify({ error: "No se ha podido subir la imagen" }), { status: 500 });

    //Actualizar logoUrl
    const menuUpdated = await updateMenuLogo(menudata._id, locals.user.email || "", `${CDN_URL}logos/${menudata.name}`);

    if (!menuUpdated) return new Response(JSON.stringify({ error: "No se ha podido actualizar el menú" }), { status: 500 });

    console.log(locals.user.email, "subio una imagen al menu", menudata.name);
    return new Response(JSON.stringify({ success: true, logoUrl: menuUpdated.logoUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export const GET: APIRoute = async ({ request, locals }) => {
    console.log(locals.user)
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}