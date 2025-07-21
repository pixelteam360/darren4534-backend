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
exports.UnitServiceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const UnitService_service_1 = require("./UnitService.service");
const createUnitService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.createUnitService(req.body, req.file, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService Created successfully!",
        data: result,
    });
}));
const singleUnitService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.singleUnitService(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService retrieved successfully!",
        data: result,
    });
}));
const providerService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.providerService(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Provider Service Created successfully!",
        data: result,
    });
}));
const myService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.myService(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "My provided Service retrieved successfully!",
        data: result,
    });
}));
const updateProviderService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.updateProviderService(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService updated successfully!",
        data: result,
    });
}));
const myUnitServices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.myUnitServices(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService retrieved successfully!",
        data: result,
    });
}));
exports.UnitServiceController = {
    createUnitService,
    singleUnitService,
    providerService,
    myService,
    updateProviderService,
    myUnitServices
};
