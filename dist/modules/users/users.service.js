"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(data) {
        const created = new this.userModel(data);
        return created.save();
    }
    findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() }).exec();
    }
    findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }
        return this.userModel
            .findById(new mongoose_2.Types.ObjectId(id))
            .select('-password -passwordResetToken -passwordResetExpires')
            .exec();
    }
    async updateById(id, data) {
        const user = await this.userModel.findById(new mongoose_2.Types.ObjectId(id)).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, data);
        return user.save();
    }
    async update(id, dto) {
        return this.updateById(id, dto);
    }
    async sanitize(user) {
        const obj = user.toObject({ virtuals: true });
        const { password, passwordResetToken, passwordResetExpires, ...safe } = obj;
        return safe;
    }
    async setPasswordReset(userId, token, expires) {
        await this.userModel
            .updateOne({ _id: new mongoose_2.Types.ObjectId(userId) }, { passwordResetToken: token, passwordResetExpires: expires })
            .exec();
    }
    async touchLastLog(userId, at) {
        await this.userModel
            .updateOne({ _id: new mongoose_2.Types.ObjectId(userId) }, { lastLogDate: at })
            .exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map