"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const Building_routes_1 = require("../modules/Building/Building.routes");
const Unit_routes_1 = require("../modules/Unit/Unit.routes");
const UnitService_routes_1 = require("../modules/UnitService/UnitService.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/building",
        route: Building_routes_1.BuildingRoutes,
    },
    {
        path: "/unit",
        route: Unit_routes_1.UnitRoutes,
    },
    {
        path: "/unit-service",
        route: UnitService_routes_1.UnitServiceRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
