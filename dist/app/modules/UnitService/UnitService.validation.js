"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitServiceValidation = void 0;
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
exports.UnitServiceValidation = {
    unitServiceSchema,
    UnitServiceUpdateSchema,
};
