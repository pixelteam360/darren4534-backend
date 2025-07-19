import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UnitValidation } from "./Unit.validation";
import auth from "../../middlewares/auth";
import { UnitController } from "./Unit.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .post(
    auth(UserRole.LANDLORD),
    validateRequest(UnitValidation.CreateUnitValidationSchema),
    UnitController.createUnit
  );

router
  .route("/assign-tenant")
  .post(
    auth(UserRole.LANDLORD),
    validateRequest(UnitValidation.AssignTenanSchema),
    UnitController.assignTenant
  );

router.post(
  "/varify",
  auth(UserRole.TENANT),
  UnitController.varifyUnitCode
);

router.post(
  "/form",
  auth(UserRole.TENANT),
  UnitController.unitForm
);

router
  .route("/:id")
  .get(auth(), UnitController.singleUnits)
  .put(auth(UserRole.LANDLORD), UnitController.updateUnit);

export const UnitRoutes = router;
