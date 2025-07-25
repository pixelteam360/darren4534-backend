"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Unit_validation_1 = require("./Unit.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Unit_controller_1 = require("./Unit.controller");
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(client_1.UserRole.LANDLORD), (0, validateRequest_1.default)(Unit_validation_1.UnitValidation.CreateUnitValidationSchema), Unit_controller_1.UnitController.createUnit);
router
    .route("/assign-tenant")
    .post((0, auth_1.default)(client_1.UserRole.LANDLORD), (0, validateRequest_1.default)(Unit_validation_1.UnitValidation.AssignTenanSchema), Unit_controller_1.UnitController.assignTenant);
router.post("/varify", (0, auth_1.default)(client_1.UserRole.TENANT), Unit_controller_1.UnitController.varifyUnitCode);
router.post("/form", (0, auth_1.default)(client_1.UserRole.TENANT), fileUploader_1.fileUploader.unitForm, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(Unit_validation_1.UnitValidation.unitFormSchema), Unit_controller_1.UnitController.unitForm);
router.get("/my", (0, auth_1.default)(client_1.UserRole.TENANT), Unit_controller_1.UnitController.getMyUnit);
router
    .route("/:id")
    .get((0, auth_1.default)(), Unit_controller_1.UnitController.singleUnits)
    .put((0, auth_1.default)(client_1.UserRole.LANDLORD), Unit_controller_1.UnitController.updateUnit)
    .delete((0, auth_1.default)(client_1.UserRole.LANDLORD), Unit_controller_1.UnitController.deleteUnitForm);
exports.UnitRoutes = router;
