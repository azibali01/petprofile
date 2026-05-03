declare const _default: () => {
    port: number;
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    openai: {
        apiKey: string;
    };
    resend: {
        apiKey: string;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
};
export default _default;
