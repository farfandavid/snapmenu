import { MercadoPagoConfig, Payment, PaymentRefund, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: import.meta.env.MP_TEST_ACCESS_TOKEN,
    options: {
        timeout: 5000,
    },

})

export const preference = new Preference(client);
export const payment = new Payment(client);
export const refund = new PaymentRefund(client);