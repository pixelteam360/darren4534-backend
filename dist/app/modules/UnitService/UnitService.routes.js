"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const UnitService_validation_1 = require("./UnitService.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const UnitService_controller_1 = require("./UnitService.controller");
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(client_1.UserRole.TENANT), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(UnitService_validation_1.UnitServiceValidation.unitServiceSchema), UnitService_controller_1.UnitServiceController.createUnitService)
    .get((0, auth_1.default)(client_1.UserRole.LANDLORD, client_1.UserRole.ADMIN), UnitService_controller_1.UnitServiceController.getAllServices);
router
    .route("/provider")
    .post((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.default)(UnitService_validation_1.UnitServiceValidation.ProviderServiceSchema), UnitService_controller_1.UnitServiceController.providerService);
router
    .route("/my-service")
    .get((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), UnitService_controller_1.UnitServiceController.myService)
    .put((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), UnitService_controller_1.UnitServiceController.updateProviderService);
router
    .route("/assign")
    .post((0, auth_1.default)(client_1.UserRole.LANDLORD), (0, validateRequest_1.default)(UnitService_validation_1.UnitServiceValidation.AssignUnitServiceSchema), UnitService_controller_1.UnitServiceController.assignUnitService)
    .get((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), UnitService_controller_1.UnitServiceController.myUnitServices);
router.route("/:id").get((0, auth_1.default)(), UnitService_controller_1.UnitServiceController.singleUnitService);
router.get("/assign/:id", (0, auth_1.default)(), UnitService_controller_1.UnitServiceController.singleAssignedService);
exports.UnitServiceRoutes = router;
