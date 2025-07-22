import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DashboardService } from "./Dashboard.service";

const landLordOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.landLordOverview(req.user.id);
  sendResponse(res, {
    message: "LandLord Overview retrieved successfully!",
    data: result,
  });
});

const tenantOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.tenantOverview(req.user.id);
  sendResponse(res, {
    message: "Tenant Overview retrieved successfully!",
    data: result,
  });
});

const serviceProviderOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.serviceProviderOverview(req.user.id);
  sendResponse(res, {
    message: "Service Provide Overview retrieved successfully!",
    data: result,
  });
});

const adminOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.adminOverview(req.user.id);
  sendResponse(res, {
    message: "Admin Overview retrieved successfully!",
    data: result,
  });
});

export const DashboardController = {
  landLordOverview,
  tenantOverview,
  serviceProviderOverview,
  adminOverview
};
