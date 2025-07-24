import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { UnitServiceService } from "./UnitService.service";
import { serviceFilterableFields } from "./user.costant";

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

const singleUnitService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.singleUnitService(req.params.id);
  sendResponse(res, {
    message: "UnitService retrieved successfully!",
    data: result,
  });
});

const providerService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.providerService(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Provider Service Created successfully!",
    data: result,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const filters = pick(req.query, serviceFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await UnitServiceService.getAllServices(filters, options);
  sendResponse(res, {
    message: "Service retrieved successfully!",
    data: result,
  });
});

const myService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.myService(req.user.id);
  sendResponse(res, {
    message: "My provided Service retrieved successfully!",
    data: result,
  });
});

const updateProviderService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.updateProviderService(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "UnitService updated successfully!",
    data: result,
  });
});

const myUnitServices = catchAsync(async (req, res) => {
  const result = await UnitServiceService.myUnitServices(req.user.id);
  sendResponse(res, {
    message: "UnitService retrieved successfully!",
    data: result,
  });
});

const assignUnitService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.assignUnitService(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Assigned UnitService successfully!",
    data: result,
  });
});

const singleAssignedService = catchAsync(async (req, res) => {
  const result = await UnitServiceService.singleAssignedService(req.params.id);
  sendResponse(res, {
    message: "Assigned UnitService retrieved successfully!",
    data: result,
  });
});

const markAsCompleted = catchAsync(async (req, res) => {
  const result = await UnitServiceService.markAsCompleted(
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Service completed",
    data: result,
  });
});

export const UnitServiceController = {
  createUnitService,
  singleUnitService,
  providerService,
  getAllServices,
  myService,
  updateProviderService,
  myUnitServices,
  assignUnitService,
  singleAssignedService,
  markAsCompleted
};
