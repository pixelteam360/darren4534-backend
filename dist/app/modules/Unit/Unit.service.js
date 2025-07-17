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
const createUnitIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
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
const getUnitsFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.findMany({
        where: { id: userId },
    });
    return result;
});
const UnitUnits = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const UnitProfile = yield prisma_1.default.unit.findMany({
        where: { id },
        select: {
            name: true,
            floor: true,
            TenantUnit: { select: { tenant: { select: { fullName: true } } } },
        },
    });
    return UnitProfile;
});
const updateUnit = (payload, UnitId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.update({
        where: { id: UnitId },
        data: payload,
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "UNAUTHORIZED access");
    }
    return result;
});
exports.UnitService = {
    createUnitIntoDb,
    getUnitsFromDb,
    UnitUnits,
    updateUnit,
};
