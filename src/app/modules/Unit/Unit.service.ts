import prisma from "../../../shared/prisma";
import { Unit } from "@prisma/client";
import { TAssignTenant, TUnit, TUnitForm } from "./Unit.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import crypto from "crypto";
import { fileUploader } from "../../../helpars/fileUploader";

const createUnit = async (payload: TUnit, userId: string) => {
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

const singleUnits = async (id: string) => {
  const UnitProfile = await prisma.unit.findMany({
    where: { id },

    select: {
      name: true,
      floor: true,
      code: true,
      AssignTenant: { select: { name: true, rentAmount: true } },
      UnitService: {
        select: { id: true, title: true, createdAt: true, status: true },
      },
      UnitForm: {
        include: {
          tenant: { select: { fullName: true, image: true, location: true } },
        },
      },
      UnitPayment: true,
    },
  });

  return UnitProfile;
};

const updateUnit = async (payload: Unit, UnitId: string, userId: string) => {
  const result = await prisma.unit.update({
    where: { id: UnitId, building: { userId } },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED access");
  }
  return result;
};

const assignTenant = async (payload: TAssignTenant, userId: string) => {
  const unit = await prisma.unit.findFirst({
    where: { id: payload.unitId },
    select: { id: true, buildingId: true },
  });

  if (!unit) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit not found");
  }

  const building = await prisma.building.findFirst({
    where: { id: unit.buildingId, userId },
    select: { id: true },
  });

  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, "Your Building not found");
  }

  const payment = Array.from({ length: payload.contractMonth }, (_, i) => {
    const date = new Date(payload.startDate);

    date.setMonth(date.getMonth() + i);

    return {
      date,
      unitId: unit.id,
    };
  });

  const result = await prisma.$transaction(async (prisma) => {
    const assign = await prisma.assignTenant.create({ data: payload });

    const pay=  await prisma.unitPayment.createMany({
      data: payment,
    });

    return assign;
  });


  return result;
};

const varifyUnitCode = async (payload: { code: number }) => {
  console.log(payload.code);
  const result = await prisma.unit.findFirst({
    where: { code: payload.code },
    select: { id: true, name: true },
  });

  return result;
};

const unitForm = async (
  payload: TUnitForm,
  userId: string,
  govtIssuedIdFile: any,
  socialSecurityCardFile: any,
  pdfCopyOfLeaseFile: any,
  rentalApplicationFile: any,
  petPolicyFormFile: any,
  backgroundCheckFile: any
) => {
  const myUnit = await prisma.unitForm.findFirst({
    where: {
      tenantId: userId,
    },
  });

  if (myUnit) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are already assigned a unit"
    );
  }

  const unit = await prisma.unit.findFirst({
    where: { id: payload.unitId },
    select: { id: true, UnitForm: true },
  });

  if (!unit) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unit not found");
  }

  if (unit?.UnitForm) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This unit is already assigned");
  }

  const [
    govtIssuedId,
    socialSecurityCard,
    pdfCopyOfLease,
    rentalApplication,
    petPolicyForm,
    backgroundCheck,
  ] = await Promise.all([
    fileUploader.uploadToDigitalOcean(govtIssuedIdFile),
    fileUploader.uploadToDigitalOcean(socialSecurityCardFile),
    fileUploader.uploadToDigitalOcean(pdfCopyOfLeaseFile),
    fileUploader.uploadToDigitalOcean(rentalApplicationFile),
    fileUploader.uploadToDigitalOcean(petPolicyFormFile),
    fileUploader.uploadToDigitalOcean(backgroundCheckFile),
  ]);

  const result = await prisma.unitForm.create({
    data: {
      ...payload,
      tenantId: userId,
      govtIssuedId: govtIssuedId.Location,
      socialSecurityCard: socialSecurityCard.Location,
      pdfCopyOfLease: pdfCopyOfLease.Location,
      rentalApplication: rentalApplication.Location,
      petPolicyForm: petPolicyForm.Location,
      backgroundCheck: backgroundCheck.Location,
    },
  });

  return result;
};

const getMyUnit = async (userId: string) => {
  const res = await prisma.unitForm.findFirst({
    where: { tenantId: userId },
    select: {
      renterName: true,
      unit: {
        select: {
          id: true,
          name: true,
          floor: true,
          UnitPayment: {
            where: { status: "PAID" },
            orderBy: { updatedAt: "desc" },
            select: { status: true, updatedAt: true },
          },
        },
      },
    },
  });

  return res;
};

const deleteUnitForm = async (id: string) => {
   await prisma.unitForm.delete({ where: { id } });

  return { message: "Tenant removed successfully" };
};

export const UnitService = {
  createUnit,
  singleUnits,
  updateUnit,
  assignTenant,
  varifyUnitCode,
  unitForm,
  getMyUnit,
};
