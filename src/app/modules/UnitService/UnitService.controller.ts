import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UnitServiceService } from "./UnitService.service";

const createUnitService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.createUnitService(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "UnitService Created successfully!",
    data: result,
  });
});

const getUnitServices = catchAsync(async (req, res) => {
  const result = await UnitServiceService.getUnitServicesFromDb(req.user.id);
  sendResponse(res, {
    message: "UnitServices retrieve successfully!",
    data: result,
  });
});

const UnitServiceUnits = catchAsync(async (req, res) => {
  const result = await UnitServiceService.UnitServiceUnits(req.params.id);
  sendResponse(res, {
    message: "UnitService Units retrieved successfully",
    data: result,
  });
});

const updateUnitService = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await UnitServiceService.updateUnitService(
    req.body,
    req.params.id,
    id
  );
  sendResponse(res, {
    message: "UnitService updated successfully!",
    data: result,
  });
});

export const UnitServiceController = {
  createUnitService,
  getUnitServices,
  UnitServiceUnits,
  updateUnitService,
};
