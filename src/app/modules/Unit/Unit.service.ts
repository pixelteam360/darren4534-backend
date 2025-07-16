import prisma from "../../../shared/prisma";
import { Unit } from "@prisma/client";
import { TUnit } from "./Unit.interface";
import crypto from "crypto";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createUnitIntoDb = async (payload: TUnit, userId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    const Unit = await prisma.unit.create({
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
      UnitId: Unit.id,
    }));

    await prisma.unit.createMany({
      data: units,
    });

    return Unit;
  });

  return result;
};

const getUnitsFromDb = async (userId: string) => {
  const result = await prisma.Unit.findMany({
    where: { userId },
  });

  return result;
};

const UnitUnits = async (id: string) => {
  const UnitProfile = await prisma.unit.findMany({
    where: { UnitId: id },

    select: {
      name: true,
      floor: true,
      TenantUnit: { select: { tenant: { select: { fullName: true } } } },
    },
  });

  return UnitProfile;
};

const updateUnit = async (
  payload: Unit,
  UnitId: string,
  userId: string
) => {
  const result = await prisma.Unit.update({
    where: { id: UnitId, userId },
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
