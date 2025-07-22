"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardValidation = void 0;
const zod_1 = require("zod");
const CreateDashboardValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    location: zod_1.z.string(),
    TotalUnit: zod_1.z.number().int(),
});
const DashboardUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    TotalUnit: zod_1.z.number().int().optional(),
});
exports.DashboardValidation = {
    CreateDashboardValidationSchema,
    DashboardUpdateSchema,
};
