import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UnitService } from "./Unit.service";

const createUnit = catchAsync(async (req, res) => {
  const result = await UnitService.createUnit(req.body, req.user.id);
  sendResponse(res, {
    message: "Unit Created successfully!",
    data: result,
  });
});

const singleUnits = catchAsync(async (req, res) => {
  const result = await UnitService.singleUnits(req.params.id);
  sendResponse(res, {
    message: "Unit Units retrieved successfully",
    data: result,
  });
});

const updateUnit = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await UnitService.updateUnit(req.body, req.params.id, id);
  sendResponse(res, {
    message: "Unit updated successfully!",
    data: result,
  });
});

const assignTenant = catchAsync(async (req, res) => {
  const result = await UnitService.assignTenant(req.body, req.user.id);
  sendResponse(res, {
    message: "Tenant assigned successfully!",
    data: result,
  });
});

const varifyUnitCode = catchAsync(async (req, res) => {
  const result = await UnitService.varifyUnitCode(req.body);
  sendResponse(res, {
    message: "Unit varified successfully!",
    data: result,
  });
});

const unitForm = catchAsync(async (req, res) => {
  const {
    govtIssuedId,
    socialSecurityCard,
    pdfCopyOfLease,
    rentalApplication,
    petPolicyForm,
    backgroundCheck,
  } = req.files as any;

  const requiredFiles = {
    govtIssuedId,
    socialSecurityCard,
    pdfCopyOfLease,
    rentalApplication,
    petPolicyForm,
    backgroundCheck,
  };

  for (const [key, value] of Object.entries(requiredFiles)) {
    if (!value || !Array.isArray(value) || value.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${key} is missing`);
    }
  }

  const result = await UnitService.unitForm(
    req.body,
    req.user.id,
    govtIssuedId[0],
    socialSecurityCard[0],
    pdfCopyOfLease[0],
    rentalApplication[0],
    petPolicyForm[0],
    backgroundCheck[0]
  );
  sendResponse(res, {
    message: "Unit form submited successfully!",
    data: result,
  });
});

const getMyUnit = catchAsync(async (req, res) => {
  const result = await UnitService.getMyUnit(req.user.id);
  sendResponse(res, {
    message: "Unit varified successfully!",
    data: result,
  });
});

export const UnitController = {
  createUnit,
  singleUnits,
  updateUnit,
  assignTenant,
  varifyUnitCode,
  unitForm,
  getMyUnit,
};
