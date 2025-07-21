import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DashboardService } from "./Dashboard.service";

const landLordOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.landLordOverview(
    req.user.id
  );
  sendResponse(res, {
    message: "LandLord Overview retrieved successfully!",
    data: result,
  });
});



export const DashboardController = {
  landLordOverview,
};
