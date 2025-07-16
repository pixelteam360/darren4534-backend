import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BuildingService } from "./Building.service";

const createBuilding = catchAsync(async (req, res) => {
  const result = await BuildingService.createBuildingIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Building Created successfully!",
    data: result,
  });
});

const getBuildings = catchAsync(async (req, res) => {
  const result = await BuildingService.getBuildingsFromDb(req.user.id);
  sendResponse(res, {
    message: "Buildings retrieve successfully!",
    data: result,
  });
});

const buildingUnits = catchAsync(async (req, res) => {
  const result = await BuildingService.buildingUnits(req.params.id);
  sendResponse(res, {
    message: "Building Units retrieved successfully",
    data: result,
  });
});

const updateBuilding = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await BuildingService.updateBuilding(
    req.body,
    req.params.id,
    id
  );
  sendResponse(res, {
    message: "Building updated successfully!",
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getBuildings,
  buildingUnits,
  updateBuilding,
};
