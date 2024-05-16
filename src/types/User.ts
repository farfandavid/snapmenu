import type { ObjectId } from "mongoose";

export interface IUser {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
};
