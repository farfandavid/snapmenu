import type { APIRoute } from 'astro';
import { preference } from '../../../config/mpconfig';

export const POST: APIRoute = async ({ request, redirect }) => {
    const result = await preference.create({
        body: {
            items: [
                {
                    title: "Test 100",
                    unit_price: 1000,
                    currency_id: "ARS", // Argentinian Peso
                    quantity: 1,
                    id: "1234",
                },
                {
                    title: "Test 100",
                    unit_price: 2000,
                    currency_id: "PE", // Argentinian Peso
                    quantity: 1,
                    id: "1234",
                }
            ],
            expires: true,
            // URLS Cliente
            auto_return: "approved",
            back_urls: {
                success: "http://localhost:3000/payment/success",
                failure: "http://localhost:3000/payment/failure",
                pending: "http://localhost:3000/payment/webhook",
            },
            // URLS Servidor
            notification_url: "https://snapmenu.onrender.com/api/payment/webhook?source_news=webhooks",

        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    })

    console.log(result);

    return redirect(result.init_point || "/")
}