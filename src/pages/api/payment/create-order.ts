import type { APIRoute } from 'astro';
import { preference } from '../../../server/config/mp';
import { z } from 'astro/zod';
import { MENU_NAMES_PROHIBITED } from '../../../server/utils/constants';
import { Menu } from '../../../server/class/Menu';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
    const body = await request.formData()
    console.log(body)
    const reqSchema = z.object({
        menuName: z.string().min(4).max(30),
        description: z.string().max(150).optional(),
        suscription: z.enum(["1 Mes", "3 Meses", "6 Meses", "12 Meses"]),
    });
    const validated = reqSchema.safeParse({
        menuName: body.get("menuName"),
        description: body.get("description"),
        suscription: body.get("suscription"),
    })
    if (!validated.success) {
        return new Response(JSON.stringify(validated.error.flatten().fieldErrors), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (MENU_NAMES_PROHIBITED.includes(validated.data.menuName.toLowerCase())) {
        return new Response("not found", { status: 404 });
    }
    const menu = await Menu.getMenuByName(validated.data.menuName);
    if (menu !== null) {
        return new Response("not found", { status: 404 });
    }

    const price = 5000;
    const unit_price = {
        "1 Mes": price,
        "3 Meses": price * 3 - price * 3 * 0.05,
        "6 Meses": price * 6 - price * 6 * 0.1,
        "12 Meses": price * 12 - price * 12 * 0.2,
    }
    const result = await preference.create({
        body: {
            items: [
                {
                    title: `${validated.data.suscription} de SnapMenu`,
                    unit_price: unit_price[validated.data.suscription],
                    currency_id: "ARS", // Argentinian Peso
                    quantity: 1,
                    id: validated.data.suscription.at(0) || "0",
                    description: `${validated.data.suscription} de SnapMenu`,
                    category_id: "virtual_goods",
                    picture_url: "https://cdn.snapmenu.online/logos/Demo"
                }
            ],
            expires: true,
            // URLS Cliente
            auto_return: "approved",
            back_urls: {
                success: "https://snapmenu.onrender.com/dashboard",
                failure: "http://localhost:3000/payment/failure",
                pending: "http://localhost:3000/payment/webhook",
            },
            // URLS Servidor
            notification_url: "https://snapmenu.onrender.com/api/payment/webhook?source_news=webhooks",
            statement_descriptor: "SNAPMENU",
            metadata: {
                account_id: locals.user.id,
                menu: validated.data.menuName,
                description: validated.data.description,
            },
        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    });
    console.log(result)
    if (!result.init_point) {
        return new Response("Error", { status: 500 });
    }
    return redirect(result.init_point)
}