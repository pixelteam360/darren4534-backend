import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { BuildingRoutes } from "../modules/Building/Building.routes";
import { UnitRoutes } from "../modules/Unit/Unit.routes";
import { UnitServiceRoutes } from "../modules/UnitService/UnitService.routes";
import { DashboardRoutes } from "../modules/Dashboard/Dashboard.routes";
import { StripRoutes } from "../modules/Strip/Strip.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/building",
    route: BuildingRoutes,
  },
  {
    path: "/unit",
    route: UnitRoutes,
  },
  {
    path: "/unit-service",
    route: UnitServiceRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/stripe",
    route: StripRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
