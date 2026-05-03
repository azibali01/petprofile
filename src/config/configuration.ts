export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/pet-profile',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
});
