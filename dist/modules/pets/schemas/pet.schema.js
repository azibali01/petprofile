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
exports.PetSchema = exports.Pet = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Pet = class Pet {
};
exports.Pet = Pet;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Pet.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['cat', 'dog'], required: true }),
    __metadata("design:type", String)
], Pet.prototype, "species", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Pet.prototype, "breed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Pet.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['male', 'female'], required: true }),
    __metadata("design:type", String)
], Pet.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Pet.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Pet.prototype, "profilePhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Pet.prototype, "photos", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                userId: { type: mongoose_2.Types.ObjectId, ref: 'User', required: true },
                role: { type: String, enum: ['primary', 'secondary'], required: true },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Pet.prototype, "owners", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            isNeutered: { type: Boolean, default: false },
            allergies: { type: [String], default: [] },
            conditions: { type: [String], default: [] },
            medications: { type: [String], default: [] },
            lastVetVisit: { type: Date },
            vetClinic: { type: String },
            vetPhone: { type: String },
            vaccines: {
                type: [
                    {
                        name: { type: String, required: true },
                        date: { type: Date },
                        nextDue: { type: Date, required: false, default: null },
                    },
                ],
                default: [],
            },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Pet.prototype, "health", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            mealTimes: { type: [String], default: [] },
            walkSchedule: { type: String },
            traits: { type: [String], default: [] },
            trainingLevel: { type: String },
            knownCommands: { type: [String], default: [] },
            favouriteToys: { type: [String], default: [] },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Pet.prototype, "behaviour", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            lastGroomingDate: { type: Date },
            frequencyWeeks: { type: Number },
            atHomeRoutine: { type: String },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Pet.prototype, "grooming", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Pet.prototype, "isActive", void 0);
exports.Pet = Pet = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Pet);
exports.PetSchema = mongoose_1.SchemaFactory.createForClass(Pet);
//# sourceMappingURL=pet.schema.js.map