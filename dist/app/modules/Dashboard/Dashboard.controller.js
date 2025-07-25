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
exports.DashboardController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Dashboard_service_1 = require("./Dashboard.service");
const landLordOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.landLordOverview(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "LandLord Overview retrieved successfully!",
        data: result,
    });
}));
const tenantOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.tenantOverview(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Tenant Overview retrieved successfully!",
        data: result,
    });
}));
const serviceProviderOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.serviceProviderOverview(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Service Provide Overview retrieved successfully!",
        data: result,
    });
}));
const adminOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.adminOverview(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Admin Overview retrieved successfully!",
        data: result,
    });
}));
const createPrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.createPrivacyIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        message: "Privacy created successfully!",
        data: result,
    });
}));
const getPrivacys = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.getPrivacysFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Privacys retrieved successfully!",
        data: result,
    });
}));
const updatePrivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.updatePrivacy(req.body, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Privacy updated successfully!",
        data: result,
    });
}));
exports.DashboardController = {
    landLordOverview,
    tenantOverview,
    serviceProviderOverview,
    adminOverview,
    getPrivacys,
    createPrivacy,
    updatePrivacy,
};
