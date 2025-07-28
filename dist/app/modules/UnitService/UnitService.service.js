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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    const unitService = yield prisma_1.default.unitService.findFirst({
        where: { id },
        include: { AssignService: true },
    });
    if (!unitService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Unit Service not found");
    }
    console.log(unitService);
    if (!unitService.AssignService) {
        return unitService;
    }
    const res = yield prisma_1.default.assignService.findFirst({
        where: { id: unitService.AssignService.id },
        select: {
            assignDate: true,
            providerService: {
                select: {
                    userId: true,
                    name: true,
                    location: true,
                    charge: true,
                    category: true,
                },
            },
            roomId: true,
            unitService: {
                select: {
                    title: true,
                    reason: true,
                    image: true,
                    unit: {
                        select: {
                            building: {
                                select: {
                                    user: {
                                        select: { id: true, fullName: true, phoneNumber: true },
                                    },
                                },
                            },
                            UnitForm: {
                                select: {
                                    renterName: true,
                                    mobileNumber: true,
                                    tenantId: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!res) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    const flatData = {
        assignDate: res.assignDate,
        roomId: res.roomId,
        title: (_b = (_a = res.unitService) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "",
        reason: (_d = (_c = res.unitService) === null || _c === void 0 ? void 0 : _c.reason) !== null && _d !== void 0 ? _d : "",
        image: (_f = (_e = res.unitService) === null || _e === void 0 ? void 0 : _e.image) !== null && _f !== void 0 ? _f : "",
        landlordId: (_l = (_k = (_j = (_h = (_g = res.unitService) === null || _g === void 0 ? void 0 : _g.unit) === null || _h === void 0 ? void 0 : _h.building) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.id) !== null && _l !== void 0 ? _l : null,
        landlordName: (_r = (_q = (_p = (_o = (_m = res.unitService) === null || _m === void 0 ? void 0 : _m.unit) === null || _o === void 0 ? void 0 : _o.building) === null || _p === void 0 ? void 0 : _p.user) === null || _q === void 0 ? void 0 : _q.fullName) !== null && _r !== void 0 ? _r : "",
        landlordPhone: (_w = (_v = (_u = (_t = (_s = res.unitService) === null || _s === void 0 ? void 0 : _s.unit) === null || _t === void 0 ? void 0 : _t.building) === null || _u === void 0 ? void 0 : _u.user) === null || _v === void 0 ? void 0 : _v.phoneNumber) !== null && _w !== void 0 ? _w : "",
        renterName: (_0 = (_z = (_y = (_x = res.unitService) === null || _x === void 0 ? void 0 : _x.unit) === null || _y === void 0 ? void 0 : _y.UnitForm) === null || _z === void 0 ? void 0 : _z.renterName) !== null && _0 !== void 0 ? _0 : "",
        renterMobile: (_4 = (_3 = (_2 = (_1 = res.unitService) === null || _1 === void 0 ? void 0 : _1.unit) === null || _2 === void 0 ? void 0 : _2.UnitForm) === null || _3 === void 0 ? void 0 : _3.mobileNumber) !== null && _4 !== void 0 ? _4 : "",
        tenantId: (_8 = (_7 = (_6 = (_5 = res.unitService) === null || _5 === void 0 ? void 0 : _5.unit) === null || _6 === void 0 ? void 0 : _6.UnitForm) === null || _7 === void 0 ? void 0 : _7.tenantId) !== null && _8 !== void 0 ? _8 : null,
        serviceDetails: {
            userId: (_10 = (_9 = res.providerService) === null || _9 === void 0 ? void 0 : _9.userId) !== null && _10 !== void 0 ? _10 : null,
            name: (_12 = (_11 = res.providerService) === null || _11 === void 0 ? void 0 : _11.name) !== null && _12 !== void 0 ? _12 : "",
            location: (_14 = (_13 = res.providerService) === null || _13 === void 0 ? void 0 : _13.location) !== null && _14 !== void 0 ? _14 : "",
            charge: (_16 = (_15 = res.providerService) === null || _15 === void 0 ? void 0 : _15.charge) !== null && _16 !== void 0 ? _16 : "",
            category: (_18 = (_17 = res.providerService) === null || _17 === void 0 ? void 0 : _17.category) !== null && _18 !== void 0 ? _18 : "",
        },
    };
    return flatData;
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
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { fullName: true },
    });
    const assignService = yield prisma_1.default.assignService.findFirst({
        where: { unitServiceId: payload.unitServiceId },
        select: { id: true },
    });
    if (assignService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This unit service is already assigned");
    }
    const unit = yield prisma_1.default.unitService.findFirst({
        where: {
            id: payload.unitServiceId,
            unit: { building: { userId } },
        },
        select: { tenant: { select: { id: true, fullName: true } } },
    });
    if (!unit) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Unit not found or it's not you building unit");
    }
    const providerService = yield prisma_1.default.providerService.findFirst({
        where: { id: payload.providerServiceId },
        select: { user: { select: { id: true, fullName: true } } },
    });
    if (!providerService) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "providerService not found");
    }
    const memberIds = [userId, providerService.user.id, unit.tenant.id];
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield prisma.room.create({
            data: {
                name: `${providerService.user.fullName}, ${unit.tenant.fullName}, ${user === null || user === void 0 ? void 0 : user.fullName}`,
                type: "GROUP",
                users: {
                    create: [
                        ...memberIds.map((userId) => ({
                            user: { connect: { id: userId } },
                        })),
                    ],
                },
            },
            select: { id: true },
        });
        const assignService = yield prisma.assignService.create({
            data: Object.assign(Object.assign({}, payload), { roomId: room.id }),
            select: { id: true },
        });
        yield prisma.unitService.update({
            where: { id: payload.unitServiceId },
            data: { status: "ONGOING" },
            select: { id: true },
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
                    image: true,
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
const markAsCompleted = (serviceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield prisma_1.default.assignService.findFirst({
        where: { id: serviceId, providerService: { userId } },
        select: { id: true, unitServiceId: true },
    });
    if (!service) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Your Assigned Service not found");
    }
    const res = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.assignService.update({
            where: { id: service.id },
            data: { status: "SOLVED" },
        });
        yield prisma.unitService.update({
            where: { id: service.unitServiceId },
            data: { status: "SOLVED" },
        });
        return { message: "Service completed" };
    }));
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
    markAsCompleted,
};
