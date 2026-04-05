export type RegisterResponse = {
    statusCode: number;
    message: string;
    data: {
        token: string;
    };
};
