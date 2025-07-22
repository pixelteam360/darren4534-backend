import { z } from "zod";

const CreateUnitValidationSchema = z.object({
  name: z.string(),
  floor: z.string().optional(),
  buildingId: z.string(),
});

const UnitUpdateSchema = z.object({
  name: z.string().optional(),
  floor: z.string().optional().optional(),
  buildingId: z.string().optional(),
});

const AssignTenanSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  contractMonth: z.number().int().min(1, "Contract month must be at least 1"),
  startDate: z.coerce.date(),
  rentAmount: z.number().nonnegative("Rent amount must be non-negative"),
  unitId: z.string(),
});

const unitFormSchema = z.object({
  renterName: z.string().min(1, "Renter name is required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  sourceOfIncome: z.string().min(1),
  permanentAddress: z.string().min(1),
  emergencyContact: z.string().min(10),
  reference: z.string().min(1),
  unitId: z.string(),
});

export const UnitValidation = {
  CreateUnitValidationSchema,
  UnitUpdateSchema,
  AssignTenanSchema,
  unitFormSchema,
};
