import prisma from "../../../shared/prisma";
import { Building } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { TBuilding } from "./Building.interface";
import crypto from "crypto";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createBuildingIntoDb = async (payload: TBuilding, userId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    const building = await prisma.building.create({
      data: {
        name: payload.name,
        location: payload.location,
        TotalUnit: payload.TotalUnit,
        userId,
      },
      select: { id: true, name: true, TotalUnit: true },
    });

    const units = Array.from({ length: payload.TotalUnit }, (_, i) => ({
      name: `Apartment 0${i + 1}`,
      code: Number(crypto.randomInt(100000, 999999)),
      buildingId: building.id,
    }));

    await prisma.unit.createMany({
      data: units,
    });

    return building;
  });

  return result;
};

const getBuildingsFromDb = async (userId: string) => {
  const result = await prisma.building.findMany({
    where: { userId },
  });

  return result;
};

const buildingUnits = async (id: string) => {
  const BuildingProfile = await prisma.unit.findMany({
    where: { buildingId: id },

    select: {
      name: true,
      floor: true,
      TenantUnit: { select: { tenant: { select: { fullName: true } } } },
    },
  });

  return BuildingProfile;
};

const updateBuilding = async (
  payload: Building,
  buildingId: string,
  userId: string
) => {
  const result = await prisma.building.update({
    where: { id: buildingId, userId },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED access");
  }
  return result;
};

export const BuildingService = {
  createBuildingIntoDb,
  getBuildingsFromDb,
  buildingUnits,
  updateBuilding,
};
