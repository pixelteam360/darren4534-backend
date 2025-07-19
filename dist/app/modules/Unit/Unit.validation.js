"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitValidation = void 0;
const zod_1 = require("zod");
const CreateUnitValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    floor: zod_1.z.string().optional(),
    buildingId: zod_1.z.string(),
});
const UnitUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    floor: zod_1.z.string().optional().optional(),
    buildingId: zod_1.z.string().optional(),
});
const AssignTenanSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    contractMonth: zod_1.z.number().int().min(1, "Contract month must be at least 1"),
    startDate: zod_1.z.coerce.date(),
    rentAmount: zod_1.z.number().nonnegative("Rent amount must be non-negative"),
    unitId: zod_1.z.string(),
});
const unitFormSchema = zod_1.z.object({
    renterName: zod_1.z.string().min(1, "Renter name is required"),
    mobileNumber: zod_1.z.string().min(10, "Valid mobile number required"),
    sourceOfIncome: zod_1.z.string().min(1),
    permanentAddress: zod_1.z.string().min(1),
    emergencyContact: zod_1.z.string().min(10),
    reference: zod_1.z.string().min(1),
    govtIssuedId: zod_1.z.string().min(1),
    socialSecurityCard: zod_1.z.string().min(1),
    pdfCopyOfLease: zod_1.z.string().url("Must be a valid URL"),
    rentalApplication: zod_1.z.string().url("Must be a valid URL"),
    petPolicyForm: zod_1.z.string().url("Must be a valid URL"),
    backgroundCheck: zod_1.z.string().url("Must be a valid URL"),
    unitId: zod_1.z.string(),
});
exports.UnitValidation = {
    CreateUnitValidationSchema,
    UnitUpdateSchema,
    AssignTenanSchema,
};
