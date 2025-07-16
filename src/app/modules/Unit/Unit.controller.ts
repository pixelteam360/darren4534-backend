import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UnitService } from "./Unit.service";

const createUnit = catchAsync(async (req, res) => {
  const result = await UnitService.createUnitIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Unit Created successfully!",
    data: result,
  });
});

const getUnits = catchAsync(async (req, res) => {
  const result = await UnitService.getUnitsFromDb(req.user.id);
  sendResponse(res, {
    message: "Units retrieve successfully!",
    data: result,
  });
});

const UnitUnits = catchAsync(async (req, res) => {
  const result = await UnitService.UnitUnits(req.params.id);
  sendResponse(res, {
    message: "Unit Units retrieved successfully",
    data: result,
  });
});

const updateUnit = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await UnitService.updateUnit(
    req.body,
    req.params.id,
    id
  );
  sendResponse(res, {
    message: "Unit updated successfully!",
    data: result,
  });
});

export const UnitController = {
  createUnit,
  getUnits,
  UnitUnits,
  updateUnit,
};
