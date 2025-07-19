import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UnitServiceValidation } from "./UnitService.validation";
import auth from "../../middlewares/auth";
import { UnitServiceController } from "./UnitService.controller";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserRole.LANDLORD, UserRole.TENANT),
    UnitServiceController.getUnitServices
  )
  .post(
    auth(UserRole.TENANT),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UnitServiceValidation.unitServiceSchema),
    UnitServiceController.createUnitService
  );

router
  .route("/:id")
  .get(auth(), UnitServiceController.UnitServiceUnits)
  .put(auth(UserRole.LANDLORD), UnitServiceController.updateUnitService);

export const UnitServiceRoutes = router;
