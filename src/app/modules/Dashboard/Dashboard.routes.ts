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

router
  .route("/privacy")
  .get(auth(), DashboardController.getPrivacys)
  .post(auth(UserRole.ADMIN), DashboardController.createPrivacy);

router
  .route("/privacy/:id")
  .patch(auth(UserRole.ADMIN), DashboardController.updatePrivacy);

export const DashboardRoutes = router;
