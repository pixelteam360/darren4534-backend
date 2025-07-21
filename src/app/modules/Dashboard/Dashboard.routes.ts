import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DashboardValidation } from "./Dashboard.validation";
import auth from "../../middlewares/auth";
import { DashboardController } from "./Dashboard.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/landlord")
  .get(auth(UserRole.LANDLORD), DashboardController.landLordOverview)



export const DashboardRoutes = router;
