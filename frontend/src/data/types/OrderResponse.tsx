import type { Order } from "./Order";

export type OrdersResponse = {
    statusCode: number;
    message: string;
    data: Order[];
};
