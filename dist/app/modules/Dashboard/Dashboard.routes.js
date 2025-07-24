"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Dashboard_controller_1 = require("./Dashboard.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/landlord")
    .get((0, auth_1.default)(client_1.UserRole.LANDLORD), Dashboard_controller_1.DashboardController.landLordOverview);
router.get("/tenant", (0, auth_1.default)(client_1.UserRole.TENANT), Dashboard_controller_1.DashboardController.tenantOverview);
router.get("/service-provider", (0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), Dashboard_controller_1.DashboardController.serviceProviderOverview);
router.get("/admin", (0, auth_1.default)(client_1.UserRole.ADMIN), Dashboard_controller_1.DashboardController.adminOverview);
router
    .route("/privacy")
    .get((0, auth_1.default)(), Dashboard_controller_1.DashboardController.getPrivacys)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN), Dashboard_controller_1.DashboardController.createPrivacy);
router
    .route("/privacy/:id")
    .patch((0, auth_1.default)(client_1.UserRole.ADMIN), Dashboard_controller_1.DashboardController.updatePrivacy);
exports.DashboardRoutes = router;
