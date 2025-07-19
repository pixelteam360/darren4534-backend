import prisma from "../../../shared/prisma";
import { UnitService } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TUnitService } from "./UnitService.interface";
import { fileUploader } from "../../../helpars/fileUploader";

const createUnitService = async (
  payload: TUnitService,
  imageFile: Express.Multer.File | undefined,
  userId: string
) => {
  if (!imageFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Image file not found");
  }

  const unit = await prisma.unit.findFirst({
    where: { id: payload.unitId },
    select: { id: true },
  });

  if (!unit) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit not found");
  }

  const image = (await fileUploader.uploadToCloudinary(imageFile)).Location;

  const result = await prisma.unitService.create({
    data: { ...payload, tenantId: userId, image },
  });

  return result;
};

const getUnitServicesFromDb = async (userId: string) => {
  // const result = await prisma.UnitService.findMany({
  //   where: { userId },
  // });

  // return result;
};

const UnitServiceUnits = async (id: string) => {
  // const UnitServiceProfile = await prisma.unit.findMany({
  //   where: { UnitServiceId: id },

  //   select: {
  //     id: true,
  //     name: true,
  //     floor: true,
  //     AssignTenant: { select: { name: true } },
  //     UnitPayment: {
  //       take: 1,
  //       orderBy: { updatedAt: "desc" },
  //       where: { status: "PAID" },
  //       select: { status: true, date: true },
  //     },
  //   },
  // });

  // return UnitServiceProfile;
};

const updateUnitService = async (
  payload: UnitService,
  UnitServiceId: string,
  userId: string
) => {
  // const result = await prisma.UnitService.update({
  //   where: { id: UnitServiceId, userId },
  //   data: payload,
  // });

  // if (!result) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED access");
  // }
  // return result;
};

export const UnitServiceService = {
  createUnitService,
  getUnitServicesFromDb,
  UnitServiceUnits,
  updateUnitService,
};
