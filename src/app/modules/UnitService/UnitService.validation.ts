import { z } from "zod";

const unitServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  unitId: z.string(),
});

const UnitServiceUpdateSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  TotalUnit: z.number().int().optional(),
});

export const ProviderServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  charge: z.string().min(1, "Charge is required"),
  category: z.string().min(1, "Category is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
});
export const AssignUnitServiceSchema = z.object({
  unitServiceId: z.string(),
  providerServiceId: z.string(),
  assignDate: z.coerce.date().optional(),
});

export const UnitServiceValidation = {
  unitServiceSchema,
  UnitServiceUpdateSchema,
  ProviderServiceSchema,
  AssignUnitServiceSchema,
};
