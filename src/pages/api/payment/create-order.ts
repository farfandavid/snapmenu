import type { APIRoute } from 'astro';
import { preference } from '../../../server/config/mp';
import { z } from 'astro/zod';
import { MENU_NAMES_PROHIBITED } from '../../../server/utils/constants';
import { Menu } from '../../../server/class/Menu';
import { PRICE } from '../../../client/utils/constant';

const reqSchema = z.object({
    menuName: z.string().min(4).max(30),
    description: z.string().max(150).optional().nullable(),
    suscription: z.enum(["1 Mes", "3 Meses", "6 Meses", "12 Meses"]),
    type: z.enum(["renew", "new"]).optional(),
});

export const POST: APIRoute = async ({ request, redirect, locals }) => {
    const body = await request.formData().catch(() => null);
    if (!body) {
        return new Response("Invalid form data", { status: 400 });
    }

    const validated = reqSchema.safeParse({
        menuName: body.get("menuName"),
        description: body.get("description"),
        suscription: body.get("suscription"),
        type: body.get("type"),
    })
    if (!validated.success) {
        return new Response(JSON.stringify({ error: "Datos invalidos" }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (MENU_NAMES_PROHIBITED.includes(validated.data.menuName.toLowerCase())) {
        return new Response("not found", { status: 404 });
    }
    const menu = await Menu.getMenuByName(validated.data.menuName);
    if (menu !== null) {
        return new Response("not found", { status: 404 });
    }

    const unit_price = {
        "1 Mes": PRICE,
        "3 Meses": PRICE * 3 - PRICE * 3 * 0.05,
        "6 Meses": PRICE * 6 - PRICE * 6 * 0.1,
        "12 Meses": PRICE * 12 - PRICE * 12 * 0.2,
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
                success: `${import.meta.env.SITE_URL}/dashboard`,
            },
            // URLS Servidor
            notification_url: `${import.meta.env.SITE_URL}/api/payment/webhook?source_news=webhooks`,
            statement_descriptor: "SNAPMENU",
            metadata: {
                account_id: locals.user.id,
                menu: validated.data.menuName,
                description: validated.data.description,
                type: validated.data.type || "new",
            },
        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    });
    if (!result.init_point) {
        return new Response("Error", { status: 500 });
    }
    return new Response("", {
        status: 300, headers: {
            "Location": result.init_point,
        },
    });
}

export const PUT: APIRoute = async ({ request, locals }) => {
    const body = await request.formData().catch(() => null);
    if (!body) {
        return new Response("Invalid form data", { status: 400 });
    }
    const validated = reqSchema.safeParse({
        menuName: body.get("menuName"),
        description: body.get("description"),
        suscription: body.get("suscription"),
        type: body.get("type"),
    })
    if (!validated.success) {
        return new Response(JSON.stringify({ error: "Datos invalidos" }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (MENU_NAMES_PROHIBITED.includes(validated.data.menuName.toLowerCase())) {
        return new Response("not found", { status: 404 });
    }
    const menu = await Menu.getMenuByName(validated.data.menuName);
    if (menu === null) {
        return new Response("not found", { status: 404 });
    }

    const unit_price = {
        "1 Mes": PRICE,
        "3 Meses": PRICE * 3 - PRICE * 3 * 0.05,
        "6 Meses": PRICE * 6 - PRICE * 6 * 0.1,
        "12 Meses": PRICE * 12 - PRICE * 12 * 0.2,
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
                success: `${import.meta.env.SITE_URL}/dashboard`,
            },
            // URLS Servidor
            notification_url: `${import.meta.env.SITE_URL}/api/payment/webhook?source_news=webhooks`,
            statement_descriptor: "SNAPMENU",
            metadata: {
                account_id: locals.user.id,
                menu: menu.name,
                description: validated.data.description,
                type: validated.data.type || "new",
            },
        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    });
    if (!result.init_point) {
        return new Response("Error", { status: 500 });
    }
    return new Response("", {
        status: 300, headers: {
            "Location": result.init_point,
        },
    });
}