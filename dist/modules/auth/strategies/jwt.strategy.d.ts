import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
export type JwtPayload = {
    sub: string;
    email: string;
};
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto: string;
        role: "primary" | "secondary";
        subscriptionPlan: "free" | "basic" | "premium";
        subscriptionStatus: "active" | "inactive" | "trial";
        trialEndsAt?: Date | undefined;
        rewardPoints: number;
        streakCount: number;
        lastLogDate?: Date | undefined;
        referralCode: string;
        referredBy?: string | undefined;
        pushToken?: string | undefined;
        isEmailVerified: boolean;
        passwordResetToken?: string | undefined;
        passwordResetExpires?: Date | undefined;
        notificationPreferences: {
            emailDaily: boolean;
            pushReEngagement: boolean;
            pushVaccine: boolean;
            pushGrooming: boolean;
            pushWeeklySummary: boolean;
        };
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
