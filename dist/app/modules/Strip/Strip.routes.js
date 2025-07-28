"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Strip_controller_1 = require("./Strip.controller");
const Strip_service_1 = require("./Strip.service");
const router = express_1.default.Router();
router.route("/auth").get((0, auth_1.default)(), Strip_controller_1.StripController.stripeAuth);
router.get("/callback", Strip_service_1.StripService.stripeCallback);
exports.StripRoutes = router;
