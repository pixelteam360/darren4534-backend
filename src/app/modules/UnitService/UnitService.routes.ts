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
  .post(
    auth(UserRole.TENANT),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UnitServiceValidation.unitServiceSchema),
    UnitServiceController.createUnitService
  )
  .get(
    auth(UserRole.LANDLORD, UserRole.ADMIN),
    UnitServiceController.getAllServices
  );

router
  .route("/provider")
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    validateRequest(UnitServiceValidation.ProviderServiceSchema),
    UnitServiceController.providerService
  );

router
  .route("/my-service")
  .get(auth(UserRole.SERVICE_PROVIDER), UnitServiceController.myService)
  .put(
    auth(UserRole.SERVICE_PROVIDER),
    UnitServiceController.updateProviderService
  );

router
  .route("/assign")
  .post(
    auth(UserRole.LANDLORD),
    validateRequest(UnitServiceValidation.AssignUnitServiceSchema),
    UnitServiceController.assignUnitService
  )
  .get(auth(UserRole.SERVICE_PROVIDER), UnitServiceController.myUnitServices);

router.route("/:id").get(auth(), UnitServiceController.singleUnitService);

router.get("/assign/:id", auth(), UnitServiceController.singleAssignedService);

export const UnitServiceRoutes = router;
