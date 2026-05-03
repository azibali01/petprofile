import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(data: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    updateById(id: string, data: Partial<User> | UpdateUserDto): Promise<UserDocument>;
    update(id: string, dto: UpdateUserDto): Promise<UserDocument>;
    sanitize(user: UserDocument): Promise<{
        [x: string]: unknown;
    }>;
    setPasswordReset(userId: string, token: string, expires: Date): Promise<void>;
    touchLastLog(userId: string, at: Date): Promise<void>;
}
