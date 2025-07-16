import { z } from "zod";

const CreateUnitValidationSchema = z.object({
  name: z.string(),
  location: z.string(),
  TotalUnit: z.number().int(),
});

const UnitUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const UnitValidation = {
  CreateUnitValidationSchema,
  UnitUpdateSchema,
};
