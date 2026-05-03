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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const cloudinary_1 = require("cloudinary");
const mongoose_2 = require("mongoose");
const pets_service_1 = require("../pets/pets.service");
const pet_document_schema_1 = require("./schemas/pet-document.schema");
let DocumentsService = class DocumentsService {
    constructor(configService, petsService, docModel) {
        this.configService = configService;
        this.petsService = petsService;
        this.docModel = docModel;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('cloudinary.cloudName'),
            api_key: this.configService.get('cloudinary.apiKey'),
            api_secret: this.configService.get('cloudinary.apiSecret'),
        });
    }
    async upload(userId, petId, file) {
        await this.petsService.findOneForUser(petId, userId);
        const folder = `pet-profile/documents/${userId}`;
        const uploaded = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'auto' }, (err, result) => {
                if (err || !result) {
                    reject(err ?? new Error('Upload failed'));
                }
                else {
                    resolve(result);
                }
            });
            stream.end(file.buffer);
        });
        return this.docModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            petId: new mongoose_2.Types.ObjectId(petId),
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        });
    }
    async listByPet(petId, userId) {
        await this.petsService.findOneForUser(petId, userId);
        return this.docModel
            .find({ petId: new mongoose_2.Types.ObjectId(petId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async delete(userId, docId) {
        const doc = await this.docModel.findById(new mongoose_2.Types.ObjectId(docId)).exec();
        if (!doc || doc.userId.toString() !== userId) {
            throw new common_1.NotFoundException('Document not found');
        }
        await cloudinary_1.v2.uploader.destroy(doc.publicId);
        await doc.deleteOne();
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(pet_document_schema_1.PetDocumentFile.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        pets_service_1.PetsService,
        mongoose_2.Model])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map