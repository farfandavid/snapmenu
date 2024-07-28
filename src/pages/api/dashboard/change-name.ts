import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MenuError } from "../../../server/interface/Menu";

export const PUT: APIRoute = async ({ request, locals }) => {
    try {
        const formData = await request.formData().catch((err) => null)
        if (!formData) {
            return new Response("Invalid form data", { status: 400 });
        }
        const menu = await Menu.getMenuByIdAndUserId(formData.get("menuId")?.toString() || "", locals.user.id || "")

        if (!menu) {
            return new Response("Invalid form data", { status: 404 });
        }

        menu.name = formData.get("menuName")?.toString() || "";
        const validate = await menu.validate()
        if (validate instanceof MenuError) {
            return new Response(JSON.stringify(validate), { status: 400 });
        }
        await menu.changeName();
        return new Response("Menu Changed", { status: 200 });
    } catch (err) {
        return new Response("Internal Server Error", { status: 500 });
    }
};