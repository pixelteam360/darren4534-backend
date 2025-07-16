import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BuildingValidation } from "./Building.validation";
import auth from "../../middlewares/auth";
import { BuildingController } from "./Building.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(auth(UserRole.LANDLORD), BuildingController.getBuildings)
  .post(
    auth(UserRole.LANDLORD),
    validateRequest(BuildingValidation.CreateBuildingValidationSchema),
    BuildingController.createBuilding
  );

router
  .route("/:id")
  .get(auth(), BuildingController.buildingUnits)
  .put(auth(UserRole.LANDLORD), BuildingController.updateBuilding);

export const BuildingRoutes = router;
