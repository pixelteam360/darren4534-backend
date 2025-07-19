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
exports.UnitService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createUnit = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const building = yield prisma_1.default.building.findFirst({
        where: { id: payload.buildingId, userId },
        select: { id: true },
    });
    if (!building) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Building not found");
    }
    const code = Number(crypto_1.default.randomInt(100000, 999999));
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const unit = yield prisma.unit.create({ data: Object.assign(Object.assign({}, payload), { code }) });
        yield prisma.building.update({
            where: { id: building.id },
            data: { TotalUnit: { increment: 1 } },
        });
        return unit;
    }));
    return result;
});
const singleUnits = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const UnitProfile = yield prisma_1.default.unit.findMany({
        where: { id },
        select: {
            name: true,
            floor: true,
            code: true,
            AssignTenant: { select: { name: true, rentAmount: true } },
            UnitService: true,
            UnitForm: {
                include: {
                    tenant: { select: { fullName: true, image: true, location: true } },
                },
            },
            UnitPayment: true,
        },
    });
    return UnitProfile;
});
const updateUnit = (payload, UnitId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.update({
        where: { id: UnitId, building: { userId } },
        data: payload,
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "UNAUTHORIZED access");
    }
    return result;
});
const assignTenant = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const unit = yield prisma_1.default.unit.findFirst({
        where: { id: payload.unitId },
        select: { id: true, buildingId: true },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Unit not found");
    }
    const building = yield prisma_1.default.building.findFirst({
        where: { id: unit.buildingId, userId },
        select: { id: true },
    });
    if (!building) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Your Building not found");
    }
    const payment = Array.from({ length: payload.contractMonth }, (_, i) => {
        const date = new Date(payload.startDate);
        date.setMonth(date.getMonth() + i);
        return {
            date,
            unitId: unit.id,
        };
    });
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const assign = yield prisma.assignTenant.create({ data: payload });
        yield prisma.unitPayment.createMany({
            data: payment,
        });
        return assign;
    }));
    return result;
});
const varifyUnitCode = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload.code);
    const result = yield prisma_1.default.unit.findFirst({
        where: { code: payload.code },
        select: { id: true, name: true },
    });
    return result;
});
const unitForm = (payload, userId, govtIssuedIdFile, socialSecurityCardFile, pdfCopyOfLeaseFile, rentalApplicationFile, petPolicyFormFile, backgroundCheckFile) => __awaiter(void 0, void 0, void 0, function* () {
    const myUnit = yield prisma_1.default.unitForm.findFirst({
        where: {
            tenantId: userId,
        },
    });
    if (myUnit) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You are already assigned a unit");
    }
    const unit = yield prisma_1.default.unit.findFirst({
        where: { id: payload.unitId },
        select: { id: true, UnitForm: true },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Unit not found");
    }
    if (unit === null || unit === void 0 ? void 0 : unit.UnitForm) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "This unit is already assigned");
    }
    const [govtIssuedId, socialSecurityCard, pdfCopyOfLease, rentalApplication, petPolicyForm, backgroundCheck,] = yield Promise.all([
        fileUploader_1.fileUploader.uploadToCloudinary(govtIssuedIdFile),
        fileUploader_1.fileUploader.uploadToCloudinary(socialSecurityCardFile),
        fileUploader_1.fileUploader.uploadToCloudinary(pdfCopyOfLeaseFile),
        fileUploader_1.fileUploader.uploadToCloudinary(rentalApplicationFile),
        fileUploader_1.fileUploader.uploadToCloudinary(petPolicyFormFile),
        fileUploader_1.fileUploader.uploadToCloudinary(backgroundCheckFile),
    ]);
    const result = yield prisma_1.default.unitForm.create({
        data: Object.assign(Object.assign({}, payload), { tenantId: userId, govtIssuedId: govtIssuedId.Location, socialSecurityCard: socialSecurityCard.Location, pdfCopyOfLease: pdfCopyOfLease.Location, rentalApplication: rentalApplication.Location, petPolicyForm: petPolicyForm.Location, backgroundCheck: backgroundCheck.Location }),
    });
    return result;
});
exports.UnitService = {
    createUnit,
    singleUnits,
    updateUnit,
    assignTenant,
    varifyUnitCode,
    unitForm,
};
