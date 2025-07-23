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
            UnitService: {
                select: { id: true, title: true, createdAt: true, status: true },
            },
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
        const pay = yield prisma.unitPayment.createMany({
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
    var _a;
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
        select: {
            id: true,
            UnitForm: true,
            AssignTenant: { select: { id: true } },
        },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Unit not found");
    }
    if (unit === null || unit === void 0 ? void 0 : unit.UnitForm) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "This unit is already assigned");
    }
    if ((_a = unit === null || unit === void 0 ? void 0 : unit.AssignTenant) === null || _a === void 0 ? void 0 : _a.id) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Owner did not assigned any tenant yet");
    }
    const [govtIssuedId, socialSecurityCard, pdfCopyOfLease, rentalApplication, petPolicyForm, backgroundCheck,] = yield Promise.all([
        fileUploader_1.fileUploader.uploadToDigitalOcean(govtIssuedIdFile),
        fileUploader_1.fileUploader.uploadToDigitalOcean(socialSecurityCardFile),
        fileUploader_1.fileUploader.uploadToDigitalOcean(pdfCopyOfLeaseFile),
        fileUploader_1.fileUploader.uploadToDigitalOcean(rentalApplicationFile),
        fileUploader_1.fileUploader.uploadToDigitalOcean(petPolicyFormFile),
        fileUploader_1.fileUploader.uploadToDigitalOcean(backgroundCheckFile),
    ]);
    const result = yield prisma_1.default.unitForm.create({
        data: Object.assign(Object.assign({}, payload), { tenantId: userId, govtIssuedId: govtIssuedId.Location, socialSecurityCard: socialSecurityCard.Location, pdfCopyOfLease: pdfCopyOfLease.Location, rentalApplication: rentalApplication.Location, petPolicyForm: petPolicyForm.Location, backgroundCheck: backgroundCheck.Location }),
    });
    return result;
});
const getMyUnit = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.unitForm.findFirst({
        where: { tenantId: userId },
        select: {
            renterName: true,
            unit: {
                select: {
                    id: true,
                    name: true,
                    floor: true,
                    UnitPayment: {
                        where: { status: "PAID" },
                        orderBy: { updatedAt: "desc" },
                        select: { status: true, updatedAt: true },
                    },
                },
            },
        },
    });
    return res;
});
const deleteUnitForm = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const unit = yield prisma_1.default.unit.findFirst({
        where: { id, building: { userId } },
        select: {
            id: true,
            AssignTenant: { select: { id: true } },
            UnitForm: { select: { id: true } },
        },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "You are not the owner of the unit");
    }
    if (!((_a = unit.AssignTenant) === null || _a === void 0 ? void 0 : _a.id) || !((_b = unit.UnitForm) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Tenant did not assign yet");
    }
    const res = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.unitForm.delete({ where: { unitId: unit.id } });
        yield prisma.assignTenant.delete({ where: { unitId: unit.id } });
        return { message: "Tenant removed successfully" };
    }));
    return res;
});
exports.UnitService = {
    createUnit,
    singleUnits,
    updateUnit,
    assignTenant,
    varifyUnitCode,
    unitForm,
    getMyUnit,
    deleteUnitForm,
};
