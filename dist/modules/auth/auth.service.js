"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const resend_1 = require("resend");
const users_service_1 = require("../users/users.service");
const FORGOT_PASSWORD_RESPONSE = {
    message: 'If this email exists, a reset link has been sent',
};
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    getResend() {
        const key = this.configService.get('resend.apiKey');
        if (!key) {
            return null;
        }
        return new resend_1.Resend(key);
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const referralCode = (0, uuid_1.v4)();
        const user = await this.usersService.create({
            email: dto.email.toLowerCase(),
            password: hashed,
            firstName: dto.firstName,
            lastName: dto.lastName,
            referralCode,
        });
        const resend = this.getResend();
        if (resend) {
            await resend.emails.send({
                from: 'Pet Profile <onboarding@resend.dev>',
                to: user.email,
                subject: 'Welcome to Pet Profile 🐾',
                html: `<p>Hi ${user.firstName},</p><p>Thanks for joining Pet Profile. We are glad you are here.</p>`,
            });
        }
        const token = await this.signUser(user.id, user.email);
        const full = await this.usersService.findById(user.id);
        const safe = full
            ? await this.usersService.sanitize(full)
            : await this.usersService.sanitize(user);
        return { access_token: token, user: safe };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = await this.signUser(user.id, user.email);
        const safeUser = await this.usersService.findById(user.id);
        const safe = safeUser
            ? await this.usersService.sanitize(safeUser)
            : await this.usersService.sanitize(user);
        return { access_token: token, user: safe };
    }
    async forgotPassword(_dto) {
        const user = await this.usersService.findByEmail(_dto.email);
        if (user) {
            const resend = this.getResend();
            if (resend) {
                const resetUrl = 'https://petprofile.app/reset?token=placeholder';
                await resend.emails.send({
                    from: 'Pet Profile <onboarding@resend.dev>',
                    to: user.email,
                    subject: 'Reset your Pet Profile password',
                    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
                });
            }
        }
        return FORGOT_PASSWORD_RESPONSE;
    }
    async signUser(userId, email) {
        const payload = { sub: userId, email };
        return this.jwtService.signAsync(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map