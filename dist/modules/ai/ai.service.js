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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const openai_1 = __importStar(require("openai"));
const pets_service_1 = require("../pets/pets.service");
const log_schema_1 = require("../logs/schemas/log.schema");
let AiService = class AiService {
    constructor(configService, petsService, logModel) {
        this.configService = configService;
        this.petsService = petsService;
        this.logModel = logModel;
    }
    openai() {
        const key = this.configService.get('openai.apiKey');
        if (!key) {
            return null;
        }
        return new openai_1.default({ apiKey: key });
    }
    async chatWithPet(userId, petId, message, history = []) {
        const pet = await this.petsService.findOneForUser(petId, userId);
        const recent = await this.logModel
            .find({ petId: new mongoose_2.Types.ObjectId(petId) })
            .sort({ loggedAt: -1 })
            .limit(15)
            .exec();
        const system = `You are a helpful pet-care assistant. Pet profile: ${JSON.stringify(pet.toObject())}. Recent logs (newest first): ${JSON.stringify(recent.map((l) => ({
            type: l.type,
            loggedAt: l.loggedAt,
            data: l.data,
        })))}. Answer concisely and practically.`;
        const client = this.openai();
        if (!client) {
            return 'OpenAI is not configured.';
        }
        const completion = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: system },
                ...history.map((h) => ({ role: h.role, content: h.content })),
                { role: 'user', content: message },
            ],
        });
        return completion.choices[0]?.message?.content ?? '';
    }
    async talkAsPet(userId, petId, message) {
        const pet = await this.petsService.findOneForUser(petId, userId);
        const moodLogs = await this.logModel
            .find({ petId: new mongoose_2.Types.ObjectId(petId), type: { $in: ['mood', 'behaviour'] } })
            .sort({ loggedAt: -1 })
            .limit(10)
            .exec();
        const system = `You are ${pet.name}, a ${pet.species}. Stay in character as the pet would "speak" (first person, playful, short). Use mood/behaviour context: ${JSON.stringify(moodLogs.map((l) => l.data))}.`;
        const client = this.openai();
        if (!client) {
            return 'OpenAI is not configured.';
        }
        const completion = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: message },
            ],
        });
        return completion.choices[0]?.message?.content ?? '';
    }
    async validateLog(input) {
        if (!input.data || Object.keys(input.data).length === 0) {
            return false;
        }
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const duplicate = await this.logModel.findOne({
            petId: new mongoose_2.Types.ObjectId(input.petId),
            userId: new mongoose_2.Types.ObjectId(input.userId),
            type: input.type,
            loggedAt: { $gte: fiveMinutesAgo },
        });
        if (duplicate) {
            return false;
        }
        const json = JSON.stringify(input.data);
        if (json.length > 4000) {
            return false;
        }
        return true;
    }
    async generateWeeklySummary(userId, petId) {
        const pet = await this.petsService.findOneForUser(petId, userId);
        const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const logs = await this.logModel
            .find({
            petId: new mongoose_2.Types.ObjectId(petId),
            loggedAt: { $gte: from },
        })
            .sort({ loggedAt: 1 })
            .exec();
        const dob = pet.dateOfBirth ? new Date(pet.dateOfBirth) : undefined;
        let ageLabel = 'age unknown';
        if (dob && !Number.isNaN(dob.getTime())) {
            const yrs = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            ageLabel = yrs <= 0 ? 'under 1 year' : `${yrs} year(s) old`;
        }
        const petProfile = {
            name: pet.name,
            species: pet.species,
            breed: pet.breed || 'unspecified',
            age: ageLabel,
        };
        const events = logs.map((l) => ({
            type: l.type,
            loggedAt: l.loggedAt.toISOString(),
            data: l.data,
        }));
        const client = this.openai();
        if (!client) {
            const lines = logs.length === 0
                ? 'No logs recorded in the past 7 days.'
                : logs
                    .map((l) => `- ${l.type} at ${l.loggedAt.toISOString()}`)
                    .join('\n');
            return {
                summary: `Weekly recap (OpenAI not configured).\n\nPet: ${pet.name} (${pet.species}, ${petProfile.breed}, ${ageLabel}).\n${lines}`,
            };
        }
        const systemPrompt = `You are a caring veterinary-adjacent assistant for pet owners. Write one concise, friendly paragraph (4–8 sentences) summarizing the pet's wellbeing and patterns from the activity logs. Highlight routines, meals, exercise, mood, health-related entries, and anything notable. Do not diagnose or prescribe medication; suggest seeing a vet when something seems urgent.`;
        const userPrompt = `Pet profile:\n${JSON.stringify(petProfile, null, 2)}\n\nEvents logged in the past 7 days (${events.length} total):\n${JSON.stringify(events, null, 2)}`;
        const completion = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });
        const summary = completion.choices[0]?.message?.content?.trim() ??
            'No summary could be generated.';
        return { summary };
    }
    async transcribeVoice(audioBuffer) {
        const client = this.openai();
        if (!client) {
            return '';
        }
        const file = await (0, openai_1.toFile)(audioBuffer, 'audio.m4a');
        const result = await client.audio.transcriptions.create({
            model: 'whisper-1',
            file,
        });
        return result.text ?? '';
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        pets_service_1.PetsService,
        mongoose_2.Model])
], AiService);
//# sourceMappingURL=ai.service.js.map