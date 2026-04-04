export type LoginResponse = {
    statusCode: number;
    message: string;
    data: {
        token: string;
    };
};
