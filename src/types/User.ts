import type { ObjectId } from "mongoose";

export interface IUser {
    id?: ObjectId;
    displayName?: string;
    uid?: string;
    email?: string;
    emailVerified?: boolean;
    disabled?: boolean;
};
