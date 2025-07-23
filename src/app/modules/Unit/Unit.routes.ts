import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UnitValidation } from "./Unit.validation";
import auth from "../../middlewares/auth";
import { UnitController } from "./Unit.controller";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

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

router.post("/varify", auth(UserRole.TENANT), UnitController.varifyUnitCode);

router.post(
  "/form",
  auth(UserRole.TENANT),
  fileUploader.unitForm,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UnitValidation.unitFormSchema),
  UnitController.unitForm
);

router.get("/my", auth(UserRole.TENANT), UnitController.getMyUnit);

router
  .route("/:id")
  .get(auth(), UnitController.singleUnits)
  .put(auth(UserRole.LANDLORD), UnitController.updateUnit)
  .delete(auth(UserRole.LANDLORD), UnitController.deleteUnitForm);

export const UnitRoutes = router;
