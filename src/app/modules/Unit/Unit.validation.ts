import { z } from "zod";

const CreateUnitValidationSchema = z.object({
  id: z.string(),
  name: z.string(),
  floor: z.string().optional(),
  buildingId: z.string(),
});

const UnitUpdateSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  floor: z.string().optional().optional(),
  buildingId: z.string().optional(),
});

export const UnitValidation = {
  CreateUnitValidationSchema,
  UnitUpdateSchema,
};
