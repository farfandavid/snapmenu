/* import type { APIRoute } from "astro";
import { updateMenuInfo } from "../../../controller/menuController";
import { z } from "astro/zod";

const menuSchema = z.object({
    menu: z.string(),
    description: z.string().max(150).optional(),
    bannerUrl: z.string().optional(),
    address: z.string().optional(),
    mapUrl: z.string().optional(),
    phone: z.string().optional(),
    social: z.array(z.string().max(50)).optional(),
    openingHours: z.array(z.object({ open: z.string(), close: z.string() })).optional(),
});

export const PUT: APIRoute = async ({ request, locals }) => {
    const data = await request.formData();
    console.log(JSON.parse(data.get("openingHours")?.toString() || "[]"));
    const validateMenu = menuSchema.safeParse({
        menu: data.get("menu")?.toString(),
        description: data.get("description")?.toString(),
        bannerUrl: data.get("bannerUrl")?.toString(),
        address: data.get("address")?.toString(),
        mapUrl: data.get("mapUrl")?.toString(),
        phone: data.get("phone")?.toString(),
        social: data.getAll("social").map((social) => social.toString()),
        openingHours: JSON.parse(data.get("openingHours")?.toString() || "[]"),
    });

    if (!validateMenu.success) {
        return new Response(JSON.stringify({ success: false }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const menuUpdated = await updateMenuInfo(data.get("menu")?.toString() || "", locals.user.email || "", {
        social: data.getAll("social"),
        openingHours: JSON.parse(data.get("openingHours")?.toString() || "[]"),
        description: data.get("description")?.toString(),
        bannerUrl: data.get("bannerUrl")?.toString(),
        address: data.get("address")?.toString(),
        mapUrl: data.get("mapUrl")?.toString(),
        phone: data.get("phone")?.toString(),
    });
    if (!menuUpdated) {
        return new Response(JSON.stringify({ success: false }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    console.log(menuUpdated);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
} */