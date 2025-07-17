"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Building_validation_1 = require("./Building.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Building_controller_1 = require("./Building.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.LANDLORD), Building_controller_1.BuildingController.getBuildings)
    .post((0, auth_1.default)(client_1.UserRole.LANDLORD), (0, validateRequest_1.default)(Building_validation_1.BuildingValidation.CreateBuildingValidationSchema), Building_controller_1.BuildingController.createBuilding);
router
    .route("/:id")
    .get((0, auth_1.default)(), Building_controller_1.BuildingController.buildingUnits)
    .put((0, auth_1.default)(client_1.UserRole.LANDLORD), Building_controller_1.BuildingController.updateBuilding);
exports.BuildingRoutes = router;
