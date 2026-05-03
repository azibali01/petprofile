import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const created = new this.userModel(data);
    return created.save();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.resolve(null);
    }
    return this.userModel
      .findById(new Types.ObjectId(id))
      .select('-password -passwordResetToken -passwordResetExpires')
      .exec();
  }

  async updateById(
    id: string,
    data: Partial<User> | UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(new Types.ObjectId(id)).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data);
    return user.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    return this.updateById(id, dto);
  }

  async sanitize(user: UserDocument) {
    const obj = user.toObject({ virtuals: true }) as Record<string, unknown>;
    const { password, passwordResetToken, passwordResetExpires, ...safe } = obj;
    return safe;
  }

  async setPasswordReset(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: new Types.ObjectId(userId) },
        { passwordResetToken: token, passwordResetExpires: expires },
      )
      .exec();
  }

  async touchLastLog(userId: string, at: Date): Promise<void> {
    await this.userModel
      .updateOne({ _id: new Types.ObjectId(userId) }, { lastLogDate: at })
      .exec();
  }
}
