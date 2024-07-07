import type { APIRoute } from 'astro';
import { preference } from '../../../server/config/mp';

export const POST: APIRoute = async ({ request, redirect }) => {
    const result = await preference.create({
        body: {
            items: [
                {
                    title: "Test 100",
                    unit_price: 4500,
                    currency_id: "ARS", // Argentinian Peso
                    quantity: 1,
                    id: "0",
                    description: "Plan básico de SnapMenu",
                    category_id: "basic"
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
            payer: {
                email: "example@example.com",
            },
            additional_info: "Información adicional",
            statement_descriptor: "SNAPMENU",
            metadata: {
                account_id: "1234567",
                menu_id: "1234567",
            }

        },
        requestOptions: {
            corporationId: "SnapMenu",
            plataformId: "www.snapmenu.online",
        }
    });
    return redirect(result.init_point || "/")
}