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
exports.BuildingService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createBuildingIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const building = yield prisma.building.create({
            data: {
                name: payload.name,
                location: payload.location,
                TotalUnit: payload.TotalUnit,
                userId,
            },
            select: { id: true, name: true, TotalUnit: true },
        });
        const units = Array.from({ length: payload.TotalUnit }, (_, i) => ({
            name: `Unit 0${i + 1}`,
            code: Number(crypto_1.default.randomInt(100000, 999999)),
            buildingId: building.id,
        }));
        yield prisma.unit.createMany({
            data: units,
        });
        return building;
    }));
    return result;
});
const getBuildingsFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.building.findMany({
        where: { userId },
    });
    return result;
});
const buildingUnits = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const BuildingProfile = yield prisma_1.default.unit.findMany({
        where: { buildingId: id },
        select: {
            id: true,
            name: true,
            floor: true,
            AssignTenant: { select: { name: true } },
            UnitPayment: {
                take: 1,
                orderBy: { updatedAt: "desc" },
                where: { status: "PAID" },
                select: { status: true, date: true },
            },
            UnitService: {
                take: 1,
                orderBy: { updatedAt: "desc" },
                where: { status: "PENDING" },
                select: { id: true, status: true },
            },
        },
    });
    return BuildingProfile;
});
const updateBuilding = (payload, buildingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.building.update({
        where: { id: buildingId, userId },
        data: payload,
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "UNAUTHORIZED access");
    }
    return result;
});
exports.BuildingService = {
    createBuildingIntoDb,
    getBuildingsFromDb,
    buildingUnits,
    updateBuilding,
};
