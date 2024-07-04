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
                    description: "Dispositivo móvil de Tienda e-commerce",
                    category_id: "premium"
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
            notification_url: "https://snapmenu.onrender.com/api/payment/webhook?source_news=webhooks&user_id=1234567",
            payer: {
                email: "example@example.com",
            },
            additional_info: "Información adicional",
            statement_descriptor: "SNAPMENU",
            metadata: {

            }

        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    })

    console.log(result);

    return redirect(result.init_point || "/")
}