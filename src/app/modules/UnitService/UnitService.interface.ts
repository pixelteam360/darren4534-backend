import { serviceStatus } from "@prisma/client";

export type TUnitService = {
  id: string;
  title: string;
  reason: string;
  image: string;
  status: serviceStatus;
  createdAt: Date;
  updatedAt: Date;
  unitId: string;
};

export type TProviderService = {
  id: string;
  name: string;
  location: string;
  charge: string;
  category: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type IServiceFilterRequest = {
  name?: string | undefined;
  location?: string | undefined;
  category?: string | undefined;
  searchTerm?: string | undefined;
};