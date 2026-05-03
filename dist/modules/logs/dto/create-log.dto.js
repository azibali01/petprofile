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
exports.CreateLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLogDto {
}
exports.CreateLogDto = CreateLogDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    (0, class_validator_1.IsEnum)([
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
    ]),
    __metadata("design:type", String)
], CreateLogDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLogDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "voiceTranscript", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateLogDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLogDto.prototype, "loggedAt", void 0);
//# sourceMappingURL=create-log.dto.js.map