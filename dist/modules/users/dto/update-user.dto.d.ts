export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string;
    role?: 'primary' | 'secondary';
    subscriptionPlan?: 'free' | 'basic' | 'premium';
    subscriptionStatus?: 'active' | 'inactive' | 'trial';
    pushToken?: string;
    isEmailVerified?: boolean;
    notificationPreferences?: Record<string, boolean>;
    streakCount?: number;
    rewardPoints?: number;
}
