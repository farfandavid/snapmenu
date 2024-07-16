
import { z } from "astro/zod";
import { Types } from "mongoose";

const suscriptionSchema = z.object({
    plan: z.enum(['none', 'basic', 'standar', 'premium']),
    status: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
    paymentDetails: z.object({
        amount: z.number(),
        method: z.string(),
    })

})

export type ISuscription = z.infer<typeof suscriptionSchema>;

export const UserSchema = z.object({
    _id: z.instanceof(Types.ObjectId).optional(),
    displayName: z.string().optional(),
    uid: z.string().optional(),
    email: z.string().email(),
    emailVerified: z.boolean().optional(),
    disabled: z.boolean().optional(),
    suscription: z.optional(suscriptionSchema),
});

export type IUser = z.infer<typeof UserSchema>;

export interface IUserErrors {
    _id?: string[] | undefined;
    displayName?: string[] | undefined;
    uid?: string[] | undefined;
    email?: string[] | undefined;
    emailVerified?: string[] | undefined;
    menuList?: string[] | undefined;
    menuLimit?: string[] | undefined;
    disabled?: string[] | undefined;
    suscription?: string[] | undefined;
}

export class UserError implements IUserErrors {

    _id?: string[] | undefined;
    displayName?: string[] | undefined;
    uid?: string[] | undefined;
    email?: string[] | undefined;
    emailVerified?: string[] | undefined;
    menuList?: string[] | undefined;
    menuLimit?: string[] | undefined;
    disabled?: string[] | undefined;
    suscription?: string[] | undefined;

    constructor(error: IUserErrors) {
        this._id = error._id;
        this.displayName = error.displayName;
        this.uid = error.uid;
        this.email = error.email;
        this.emailVerified = error.emailVerified;
        this.menuList = error.menuList;
        this.menuLimit = error.menuLimit;
        this.disabled = error.disabled;

    }
}
