import type { APIRoute } from "astro";
import { updateMenuInfo } from "../../../controller/menuController";

export const PUT: APIRoute = async ({ request, locals }) => {
    const data = await request.formData();
    const menuUpdated = await updateMenuInfo(data.get("menu")?.toString() || "", locals.user.email || "", { bannerUrl: data.get("bannerUrl")?.toString() || "", address: data.get("address")?.toString() || "", phone: data.get("phone")?.toString() || "", mapUrl: data.get("mapUrl")?.toString() || "", social: [data.get("social-x"), data.get("social-facebook"), data.get("social-instagram"), data.get("social-youtube")] });
    console.log(menuUpdated);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}