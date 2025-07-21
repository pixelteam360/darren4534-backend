import { z } from "zod";

const CreateDashboardValidationSchema = z.object({
  name: z.string(),
  location: z.string(),
  TotalUnit: z.number().int(),
});

const DashboardUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const DashboardValidation = {
  CreateDashboardValidationSchema,
  DashboardUpdateSchema,
};
