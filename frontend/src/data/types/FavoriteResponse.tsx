import type { Favorite } from "./Favorite";

export type FavoriteResponse = {
    statusCode: number;
    message: string;
    data: Favorite[];
};
