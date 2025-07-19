import { serviceStatus } from "@prisma/client";
import { nativeEnum, z } from "zod";

const unitServiceSchema  = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  status: nativeEnum(serviceStatus),
  unitId: z.string(),
});

const UnitServiceUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const UnitServiceValidation = {
  unitServiceSchema ,
  UnitServiceUpdateSchema,
};
