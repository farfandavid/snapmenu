declare module 'jsonwebtoken';
declare module 'bcryptjs';
declare module 'firebase/auth';
/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        user: {
            id?: ObjectId;
            displayName?: string;
            uid?: string;
            email?: string;
            emailVerified?: boolean;
            menuList: string[];
            menuLimit: number;
            disabled?: boolean;
        }
    }
}