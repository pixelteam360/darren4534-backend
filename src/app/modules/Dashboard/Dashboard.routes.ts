import express from "express";
import auth from "../../middlewares/auth";
import { DashboardController } from "./Dashboard.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/landlord")
  .get(auth(UserRole.LANDLORD), DashboardController.landLordOverview);

router.get(
  "/tenant",
  auth(UserRole.TENANT),
  DashboardController.tenantOverview
);

router.get(
  "/service-provider",
  auth(UserRole.SERVICE_PROVIDER),
  DashboardController.serviceProviderOverview
);

router.get("/admin", auth(UserRole.ADMIN), DashboardController.adminOverview);

export const DashboardRoutes = router;
