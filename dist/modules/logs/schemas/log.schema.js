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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSchema = exports.Log = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Log = class Log {
};
exports.Log = Log;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Log.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Log.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [
            'meal',
            'walk',
            'mood',
            'behaviour',
            'symptom',
            'medication',
            'vet_visit',
            'grooming',
            'expense',
            'weight',
            'training',
        ],
        required: true,
    }),
    __metadata("design:type", String)
], Log.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Log.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Log.prototype, "isValidated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Log.prototype, "pointsAwarded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Log.prototype, "voiceTranscript", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Log.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: () => new Date() }),
    __metadata("design:type", Date)
], Log.prototype, "loggedAt", void 0);
exports.Log = Log = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: true, updatedAt: false } })
], Log);
exports.LogSchema = mongoose_1.SchemaFactory.createForClass(Log);
//# sourceMappingURL=log.schema.js.map