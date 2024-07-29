import { Schema } from 'mongoose';

interface Item {
    _id: string;
    title: string;
    description?: string;
    category_id: 'Basic' | 'Standard' | 'Premium';
    quantity: number;
    unit_price: number;
    currency_id: string;
}

interface Payer {
    _id: string;
    email: string | undefined;
    first_name?: string;
    last_name?: string;
    account_id: string;
    menu: string;
}

export interface IPayment {
    _id?: Schema.Types.ObjectId;
    id_transaction: number | undefined;
    date_created: Date;
    date_approved?: Date;
    date_last_updated?: Date;
    status: string | undefined;
    status_detail?: string;
    payment_method: string | undefined;
    currency_id: string | undefined;
    transaction_amount: number | undefined;
    transaction_amount_refunded?: number;
    payer?: Payer;
    items?: Item[];
}