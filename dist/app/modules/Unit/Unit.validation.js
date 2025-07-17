"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitValidation = void 0;
const zod_1 = require("zod");
const CreateUnitValidationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    floor: zod_1.z.string().optional(),
    buildingId: zod_1.z.string(),
});
const UnitUpdateSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    floor: zod_1.z.string().optional().optional(),
    buildingId: zod_1.z.string().optional(),
});
exports.UnitValidation = {
    CreateUnitValidationSchema,
    UnitUpdateSchema,
};
