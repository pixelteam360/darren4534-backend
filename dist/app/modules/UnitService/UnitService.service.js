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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const user_costant_1 = require("./user.costant");
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
const getAllServices = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: user_costant_1.serviceSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.providerService.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.providerService.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
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
    const res = yield prisma_1.default.assignService.findMany({
        where: { providerServiceId: providerService.id },
        select: {
            id: true,
            status: true,
            unitService: {
                select: {
                    unit: {
                        select: { building: { select: { name: true, location: true } } },
                    },
                    tenant: { select: { fullName: true, phoneNumber: true } },
                },
            },
        },
    });
    return res;
});
const assignUnitService = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignService = yield prisma_1.default.assignService.findFirst({
        where: { unitServiceId: payload.unitServiceId },
    });
    if (assignService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This unit service is already assigned");
    }
    const unit = yield prisma_1.default.unitService.findFirst({
        where: { id: payload.unitServiceId, unit: { building: { userId } } },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Unit not found or it's not you building unit");
    }
    const providerService = yield prisma_1.default.providerService.findFirst({
        where: { id: payload.providerServiceId },
    });
    if (!providerService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "providerService not found");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const assignService = yield prisma.assignService.create({
            data: payload,
        });
        yield prisma.unitService.update({
            where: { id: payload.unitServiceId },
            data: { status: "ONGOING" },
        });
        return assignService;
    }));
    return result;
});
const singleAssignedService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.assignService.findFirst({
        where: { id },
        select: {
            assignDate: true,
            unitService: {
                select: {
                    title: true,
                    reason: true,
                    unit: {
                        select: {
                            building: {
                                select: {
                                    user: { select: { fullName: true, phoneNumber: true } },
                                },
                            },
                            UnitForm: { select: { renterName: true, mobileNumber: true } },
                        },
                    },
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
    getAllServices,
    myService,
    updateProviderService,
    myUnitServices,
    assignUnitService,
    singleAssignedService,
};
