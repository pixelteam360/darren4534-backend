import prisma from "../../../shared/prisma";
import { Unit } from "@prisma/client";
import { TUnit } from "./Unit.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import crypto from "crypto";

const createUnitIntoDb = async (payload: TUnit, userId: string) => {
  const building = await prisma.building.findFirst({
    where: { id: payload.buildingId, userId },
    select: { id: true },
  });

  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
  }

  const code = Number(crypto.randomInt(100000, 999999));

  const result = await prisma.$transaction(async (prisma) => {
    const unit = await prisma.unit.create({ data: { ...payload, code } });

    await prisma.building.update({
      where: { id: building.id },
      data: { TotalUnit: { increment: 1 } },
    });

    return unit;
  });

  return result;
};

const getUnitsFromDb = async (userId: string) => {
  const result = await prisma.unit.findMany({
    where: { id: userId },
  });

  return result;
};

const UnitUnits = async (id: string) => {
  const UnitProfile = await prisma.unit.findMany({
    where: { id },

    select: {
      name: true,
      floor: true,
      TenantUnit: { select: { tenant: { select: { fullName: true } } } },
    },
  });

  return UnitProfile;
};

const updateUnit = async (payload: Unit, UnitId: string, userId: string) => {
  const result = await prisma.unit.update({
    where: { id: UnitId },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED access");
  }
  return result;
};   

export const UnitService = {
  createUnitIntoDb,
  getUnitsFromDb,
  UnitUnits,
  updateUnit,
};
