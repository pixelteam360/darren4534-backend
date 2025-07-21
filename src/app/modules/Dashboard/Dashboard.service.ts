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

export const DashboardService = {
  landLordOverview,
};
