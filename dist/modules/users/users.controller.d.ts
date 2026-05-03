import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(userId: string): Promise<{
        [x: string]: unknown;
    } | null>;
    updateMe(userId: string, dto: UpdateUserDto): Promise<{
        [x: string]: unknown;
    }>;
}
