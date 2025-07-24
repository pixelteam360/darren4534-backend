import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const landLordOverview = async (userId: string) => {
  const totalBuilding = await prisma.building.count({
    where: { userId },
  });

  const totalUnit = await prisma.unit.count({
    where: { building: { userId } },
  });

  const rentUnit = await prisma.unit.count({
    where: { building: { userId }, AssignTenant: { isNot: null } },
  });

  const totalService = await prisma.unitService.count({
    where: { unit: { building: { userId } } },
  });

  return {
    totalBuilding,
    totalUnit,
    rentUnit,
    totalService,
  };
};

const tenantOverview = async (userId: string) => {
  const unitForm = await prisma.unitForm.findFirst({
    where: { tenantId: userId },
    select: { unitId: true },
  });

  const unitPayment = await prisma.unitPayment.findFirst({
    where: { unitId: unitForm?.unitId },
    orderBy: { updatedAt: "desc" },
    take: 1,
    select: { updatedAt: true },
  });

  const serviceRequest = await prisma.unitService.count({
    where: { tenantId: userId },
  });

  return {
    serviceRequest,
    lastPayRent: unitPayment,
  };
};

const serviceProviderOverview = async (userId: string) => {
  const totalProject = await prisma.assignService.count({
    where: { providerService: { userId } },
  });
  const pendingProject = await prisma.assignService.count({
    where: { providerService: { userId }, status: "ONGOING" },
  });

  return { totalProject, pendingProject };
};

const adminOverview = async (userId: string) => {
  const totalBuilding = await prisma.building.count();
  const totalUnit = await prisma.unit.count();
  const totalService = await prisma.unitService.count();

  return { totalBuilding, totalUnit, totalService };
};

const createPrivacyIntoDb = async (payload: { description: string }) => {
  const privacy = await prisma.privacyPolicy.findMany();

  if (privacy.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already have a privacy policy"
    );
  }

  const result = await prisma.privacyPolicy.create({
    data: payload,
  });
  return result;
};

const getPrivacysFromDb = async () => {
  const Privacy = await prisma.privacyPolicy.findMany();
  return Privacy;
};

const updatePrivacy = async (
  payload: { description: string },
  PrivacyId: string
) => {
  const result = await prisma.privacyPolicy.update({
    where: { id: PrivacyId },
    data: payload,
  });
  return result;
};

export const DashboardService = {
  landLordOverview,
  tenantOverview,
  serviceProviderOverview,
  adminOverview,
  createPrivacyIntoDb,
  getPrivacysFromDb,
  updatePrivacy,
};
