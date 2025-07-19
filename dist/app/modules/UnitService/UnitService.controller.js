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
const getUnitServices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.getUnitServicesFromDb(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitServices retrieve successfully!",
        data: result,
    });
}));
const UnitServiceUnits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UnitService_service_1.UnitServiceService.UnitServiceUnits(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService Units retrieved successfully",
        data: result,
    });
}));
const updateUnitService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield UnitService_service_1.UnitServiceService.updateUnitService(req.body, req.params.id, id);
    (0, sendResponse_1.default)(res, {
        message: "UnitService updated successfully!",
        data: result,
    });
}));
exports.UnitServiceController = {
    createUnitService,
    getUnitServices,
    UnitServiceUnits,
    updateUnitService,
};
