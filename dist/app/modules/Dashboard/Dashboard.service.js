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
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const landLordOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBuilding = yield prisma_1.default.building.count({
        where: { userId },
    });
    const totalUnit = yield prisma_1.default.unit.count({
        where: { building: { userId } },
    });
    const rentUnit = yield prisma_1.default.unit.count({
        where: { building: { userId }, AssignTenant: { isNot: null } },
    });
    const totalService = yield prisma_1.default.unitService.count({
        where: { unit: { building: { userId } } },
    });
    return {
        totalBuilding,
        totalUnit,
        rentUnit,
        totalService,
    };
});
const tenantOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const unitForm = yield prisma_1.default.unitForm.findFirst({
        where: { tenantId: userId },
        select: { unitId: true },
    });
    const unitPayment = yield prisma_1.default.unitPayment.findFirst({
        where: { unitId: unitForm === null || unitForm === void 0 ? void 0 : unitForm.unitId },
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { updatedAt: true },
    });
    const serviceRequest = yield prisma_1.default.unitService.count({
        where: { tenantId: userId },
    });
    return {
        serviceRequest,
        lastPayRent: unitPayment,
    };
});
const serviceProviderOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalProject = yield prisma_1.default.assignService.count({
        where: { providerService: { userId } },
    });
    const pendingProject = yield prisma_1.default.assignService.count({
        where: { providerService: { userId }, status: "ONGOING" },
    });
    return { totalProject, pendingProject };
});
const adminOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBuilding = yield prisma_1.default.building.count();
    const totalUnit = yield prisma_1.default.unit.count();
    const totalService = yield prisma_1.default.unitService.count();
    return { totalBuilding, totalUnit, totalService };
});
exports.DashboardService = {
    landLordOverview,
    tenantOverview,
    serviceProviderOverview,
    adminOverview
};
