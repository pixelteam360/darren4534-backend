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
exports.UnitController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Unit_service_1 = require("./Unit.service");
const createUnit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Unit_service_1.UnitService.createUnitIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Unit Created successfully!",
        data: result,
    });
}));
const getUnits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Unit_service_1.UnitService.getUnitsFromDb(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Units retrieve successfully!",
        data: result,
    });
}));
const UnitUnits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Unit_service_1.UnitService.UnitUnits(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Unit Units retrieved successfully",
        data: result,
    });
}));
const updateUnit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield Unit_service_1.UnitService.updateUnit(req.body, req.params.id, id);
    (0, sendResponse_1.default)(res, {
        message: "Unit updated successfully!",
        data: result,
    });
}));
exports.UnitController = {
    createUnit,
    getUnits,
    UnitUnits,
    updateUnit,
};
