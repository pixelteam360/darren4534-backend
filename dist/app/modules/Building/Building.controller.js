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
exports.BuildingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Building_service_1 = require("./Building.service");
const createBuilding = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Building_service_1.BuildingService.createBuildingIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Building Created successfully!",
        data: result,
    });
}));
const getBuildings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Building_service_1.BuildingService.getBuildingsFromDb(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Buildings retrieve successfully!",
        data: result,
    });
}));
const buildingUnits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Building_service_1.BuildingService.buildingUnits(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Building Units retrieved successfully",
        data: result,
    });
}));
const updateBuilding = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield Building_service_1.BuildingService.updateBuilding(req.body, req.params.id, id);
    (0, sendResponse_1.default)(res, {
        message: "Building updated successfully!",
        data: result,
    });
}));
exports.BuildingController = {
    createBuilding,
    getBuildings,
    buildingUnits,
    updateBuilding,
};
