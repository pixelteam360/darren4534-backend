"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitServiceService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createUnitService = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!imageFile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Image file not found");
    }
    const unit = yield prisma_1.default.unit.findFirst({
        where: { id: payload.unitId },
        select: { id: true },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Unit not found");
    }
    const image = (yield fileUploader_1.fileUploader.uploadToCloudinary(imageFile)).Location;
    const result = yield prisma_1.default.unitService.create({
        data: Object.assign(Object.assign({}, payload), { tenantId: userId, image }),
    });
    return result;
});
const singleUnitService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.unitService.findFirst({ where: { id } });
    return res;
});
const providerService = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const providerService = yield prisma_1.default.providerService.findFirst({
        where: { userId },
        select: { id: true },
    });
    if (providerService) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created your service");
    }
    const result = yield prisma_1.default.providerService.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const myService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.providerService.findFirst({ where: { userId } });
    return res;
});
const updateProviderService = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.providerService.update({
        where: { userId },
        data: payload,
    });
    return result;
});
const myUnitServices = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const providerService = yield prisma_1.default.providerService.findFirst({
        where: { userId },
        select: { id: true },
    });
    if (!providerService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User service not found");
    }
    const res = yield prisma_1.default.unitService.findMany({
        where: { providerServiceId: providerService.id },
        select: {
            id: true,
            title: true,
            unit: {
                select: {
                    UnitForm: { select: { renterName: true, mobileNumber: true } },
                    building: { select: { location: true } },
                },
            },
        },
    });
    return res;
});
exports.UnitServiceService = {
    createUnitService,
    singleUnitService,
    providerService,
    myService,
    updateProviderService,
    myUnitServices,
};
