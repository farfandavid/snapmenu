declare module 'jsonwebtoken';
declare module 'bcryptjs';
declare module 'firebase/auth';
/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        user: {
            id?: string | undefined;
            displayName?: string | undefined;
            uid?: string | undefined;
            email?: string | undefined;
            emailVerified?: boolean | undefined;
            menuLimit: number | undefined;
            disabled?: boolean | undefined;
        }
    }
}