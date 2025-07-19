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
