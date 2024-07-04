import { Document, Schema } from 'mongoose';

interface Item {
    _id: string;
    title: string;
    description?: string;
    category_id: 'Basic' | 'Standard' | 'Premium';
    picture_url?: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
}

interface Payer {
    _id: Schema.Types.ObjectId;
    email: string;
    first_name?: string;
    last_name?: string;
    account_id: string;
}

interface Payment extends Document {
    _id: Schema.Types.ObjectId;
    id_transaction: string;
    date_created: Date;
    date_approved?: Date;
    date_last_updated?: Date;
    status: string;
    status_detail?: string;
    payment_method: string;
    currency_id: string;
    transaction_amount: number;
    transaction_amount_refunded?: number;
    payer: Payer;
    items: Item[];
}