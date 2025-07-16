import { z } from "zod";

const CreateBuildingValidationSchema = z.object({
  name: z.string(),
  location: z.string(),
  TotalUnit: z.number().int(),
});

const BuildingUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const BuildingValidation = {
  CreateBuildingValidationSchema,
  BuildingUpdateSchema,
};
