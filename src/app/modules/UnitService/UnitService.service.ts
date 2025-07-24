import prisma from "../../../shared/prisma";
import { Prisma, ProviderService } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import {
  IServiceFilterRequest,
  TProviderService,
  TUnitService,
} from "./UnitService.interface";
import { fileUploader } from "../../../helpars/fileUploader";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { serviceSearchAbleFields } from "./user.costant";

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

const singleUnitService = async (id: string) => {
  const unitService = await prisma.unitService.findFirst({
    where: { id },
    include: { AssignService: true },
  });

  if (!unitService) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit Service not found");
  }
  console.log(unitService);

  if (!unitService.AssignService) {
    return unitService;
  }

  const res = await prisma.assignService.findFirst({
    where: { id: unitService.AssignService.id },
    select: {
      assignDate: true,
      providerService: {
        select: {
          userId: true,
          name: true,
          location: true,
          charge: true,
          category: true,
        },
      },
      roomId: true,
      unitService: {
        select: {
          title: true,
          reason: true,
          image: true,
          unit: {
            select: {
              building: {
                select: {
                  user: {
                    select: { id: true, fullName: true, phoneNumber: true },
                  },
                },
              },
              UnitForm: {
                select: {
                  renterName: true,
                  mobileNumber: true,
                  tenantId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!res) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  const flatData = {
    assignDate: res.assignDate,
    roomId: res.roomId,
    title: res.unitService?.title ?? "",
    reason: res.unitService?.reason ?? "",
    image: res.unitService?.image ?? "",

    landlordId: res.unitService?.unit?.building?.user?.id ?? null,
    landlordName: res.unitService?.unit?.building?.user?.fullName ?? "",
    landlordPhone: res.unitService?.unit?.building?.user?.phoneNumber ?? "",

    renterName: res.unitService?.unit?.UnitForm?.renterName ?? "",
    renterMobile: res.unitService?.unit?.UnitForm?.mobileNumber ?? "",
    tenantId: res.unitService?.unit?.UnitForm?.tenantId ?? null,
    serviceDetails: {
      userId: res.providerService?.userId ?? null,
      name: res.providerService?.name ?? "",
      location: res.providerService?.location ?? "",
      charge: res.providerService?.charge ?? "",
      category: res.providerService?.category ?? "",
    },
  };

  return flatData;
};

const providerService = async (payload: TProviderService, userId: string) => {
  const providerService = await prisma.providerService.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (providerService) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your service"
    );
  }

  const result = await prisma.providerService.create({
    data: { ...payload, userId },
  });

  return result;
};

const getAllServices = async (
  params: IServiceFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ProviderServiceWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: serviceSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProviderServiceWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.providerService.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.providerService.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const myService = async (userId: string) => {
  const res = await prisma.providerService.findFirst({ where: { userId } });

  return res;
};

const updateProviderService = async (
  payload: Partial<ProviderService>,
  userId: string
) => {
  const result = await prisma.providerService.update({
    where: { userId },
    data: payload,
  });

  return result;
};

const myUnitServices = async (userId: string) => {
  const providerService = await prisma.providerService.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!providerService) {
    throw new ApiError(httpStatus.NOT_FOUND, "User service not found");
  }

  const res = await prisma.assignService.findMany({
    where: { providerServiceId: providerService.id },
    select: {
      id: true,
      status: true,
      unitService: {
        select: {
          unit: {
            select: { building: { select: { name: true, location: true } } },
          },
          tenant: { select: { fullName: true, phoneNumber: true } },
        },
      },
    },
  });
  return res;
};

const assignUnitService = async (
  payload: {
    providerServiceId: string;
    unitServiceId: string;
    assignDate: string;
  },
  userId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { fullName: true },
  });

  const assignService = await prisma.assignService.findFirst({
    where: { unitServiceId: payload.unitServiceId },
    select: { id: true },
  });

  if (assignService) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "This unit service is already assigned"
    );
  }

  const unit = await prisma.unitService.findFirst({
    where: {
      id: payload.unitServiceId,
      unit: { building: { userId } },
    },
    select: { tenant: { select: { id: true, fullName: true } } },
  });

  if (!unit) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Unit not found or it's not you building unit"
    );
  }
  const providerService = await prisma.providerService.findFirst({
    where: { id: payload.providerServiceId },
    select: { user: { select: { id: true, fullName: true } } },
  });

  if (!providerService) {
    throw new ApiError(httpStatus.NOT_FOUND, "providerService not found");
  }

  const memberIds = [userId, providerService.user.id, unit.tenant.id];

  const result = await prisma.$transaction(async (prisma) => {
    const room = await prisma.room.create({
      data: {
        name: `${providerService.user.fullName}, ${unit.tenant.fullName}, ${user?.fullName}`,
        type: "GROUP",
        users: {
          create: [
            ...memberIds.map((userId: string) => ({
              user: { connect: { id: userId } },
            })),
          ],
        },
      },

      select: { id: true },
    });

    const assignService = await prisma.assignService.create({
      data: { ...payload, roomId: room.id },
      select: { id: true },
    });

    await prisma.unitService.update({
      where: { id: payload.unitServiceId },
      data: { status: "ONGOING" },
      select: { id: true },
    });

    return assignService;
  });

  return result;
};

const singleAssignedService = async (id: string) => {
  const res = await prisma.assignService.findFirst({
    where: { id },
    select: {
      assignDate: true,
      unitService: {
        select: {
          title: true,
          reason: true,
          image: true,
          unit: {
            select: {
              building: {
                select: {
                  user: { select: { fullName: true, phoneNumber: true } },
                },
              },
              UnitForm: { select: { renterName: true, mobileNumber: true } },
            },
          },
        },
      },
    },
  });
  return res;
};

const markAsCompleted = async (serviceId: string, userId: string) => {
  const service = await prisma.assignService.findFirst({
    where: { id: serviceId, providerService: { userId } },
    select: { id: true, unitServiceId: true },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Your Assigned Service not found");
  }

  const res = await prisma.$transaction(async (prisma) => {
    await prisma.assignService.update({
      where: { id: service.id },
      data: { status: "SOLVED" },
    });

    await prisma.unitService.update({
      where: { id: service.unitServiceId },
      data: { status: "SOLVED" },
    });

    return { message: "Service completed" };
  });

  return res;
};

export const UnitServiceService = {
  createUnitService,
  singleUnitService,
  providerService,
  getAllServices,
  myService,
  updateProviderService,
  myUnitServices,
  assignUnitService,
  singleAssignedService,
  markAsCompleted,
};
