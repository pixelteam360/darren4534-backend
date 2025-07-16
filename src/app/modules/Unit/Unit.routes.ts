import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UnitValidation } from "./Unit.validation";
import auth from "../../middlewares/auth";
import { UnitController } from "./Unit.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(auth(UserRole.LANDLORD), UnitController.getUnits)
  .post(
    auth(UserRole.LANDLORD),
    validateRequest(UnitValidation.CreateUnitValidationSchema),
    UnitController.createUnit
  );

router
  .route("/:id")
  .get(auth(), UnitController.UnitUnits)
  .put(auth(UserRole.LANDLORD), UnitController.updateUnit);

export const UnitRoutes = router;
