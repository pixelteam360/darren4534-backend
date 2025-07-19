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
const getUnitServicesFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.UnitService.findMany({
    //   where: { userId },
    // });
    // return result;
});
const UnitServiceUnits = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const UnitServiceProfile = await prisma.unit.findMany({
    //   where: { UnitServiceId: id },
    //   select: {
    //     id: true,
    //     name: true,
    //     floor: true,
    //     AssignTenant: { select: { name: true } },
    //     UnitPayment: {
    //       take: 1,
    //       orderBy: { updatedAt: "desc" },
    //       where: { status: "PAID" },
    //       select: { status: true, date: true },
    //     },
    //   },
    // });
    // return UnitServiceProfile;
});
const updateUnitService = (payload, UnitServiceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.UnitService.update({
    //   where: { id: UnitServiceId, userId },
    //   data: payload,
    // });
    // if (!result) {
    //   throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED access");
    // }
    // return result;
});
exports.UnitServiceService = {
    createUnitService,
    getUnitServicesFromDb,
    UnitServiceUnits,
    updateUnitService,
};
