
import { z } from "astro/zod";

export const UserSchema = z.object({
    id: z.string().optional(),
    displayName: z.string().optional(),
    uid: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    menuList: z.array(z.string()),
    menuLimit: z.number(),
    disabled: z.boolean().optional(),
});

export type IUser = z.infer<typeof UserSchema>;

export interface IUserErrors {
    displayName?: string[] | undefined;
    email?: string[] | undefined;
    disabled?: string[] | undefined;
}

export class UserError implements IUserErrors {
    displayName?: string[] | undefined;
    email?: string[] | undefined;
    disabled?: string[] | undefined;

    constructor(error: IUserErrors) {
        this.displayName = error.displayName;
        this.email = error.email;
        this.disabled = error.disabled;
    }
}
