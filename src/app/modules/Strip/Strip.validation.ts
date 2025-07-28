import { z } from "zod";

const CreateStripValidationSchema = z.object({
  name: z.string(),
  location: z.string(),
  TotalUnit: z.number().int(),
});

const StripUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const StripValidation = {
  CreateStripValidationSchema,
  StripUpdateSchema,
};
