import type { User } from "./User";

export type UsersResponse = {
    statusCode: number;
    message: string;
    data: User;
};
