"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitServiceValidation = exports.AssignUnitServiceSchema = exports.ProviderServiceSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const unitServiceSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    reason: zod_1.z.string().min(1, "Reason is required"),
    status: (0, zod_1.nativeEnum)(client_1.serviceStatus),
    unitId: zod_1.z.string(),
});
const UnitServiceUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    TotalUnit: zod_1.z.number().int().optional(),
});
exports.ProviderServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    charge: zod_1.z.string().min(1, "Charge is required"),
    category: zod_1.z.string().min(1, "Category is required"),
    phoneNumber: zod_1.z.string().min(10, "Phone number is required"),
});
exports.AssignUnitServiceSchema = zod_1.z.object({
    unitServiceId: zod_1.z.string(),
    providerServiceId: zod_1.z.string(),
    assignDate: zod_1.z.coerce.date().optional(),
});
exports.UnitServiceValidation = {
    unitServiceSchema,
    UnitServiceUpdateSchema,
    ProviderServiceSchema: exports.ProviderServiceSchema,
    AssignUnitServiceSchema: exports.AssignUnitServiceSchema,
};
