import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    role: 'primary' | 'secondary';
    subscriptionPlan: 'free' | 'basic' | 'premium';
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    trialEndsAt?: Date;
    rewardPoints: number;
    streakCount: number;
    lastLogDate?: Date;
    referralCode: string;
    referredBy?: string;
    pushToken?: string;
    isEmailVerified: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    notificationPreferences: {
        emailDaily: boolean;
        pushReEngagement: boolean;
        pushVaccine: boolean;
        pushGrooming: boolean;
        pushWeeklySummary: boolean;
    };
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
