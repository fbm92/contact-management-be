"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(4).max(20),
    password: zod_1.z.string().min(6).max(12),
    name: zod_1.z.string().min(1).max(32),
});
UserValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string().min(4).max(20),
    password: zod_1.z.string().min(6).max(12)
});
UserValidation.UPDATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(32).optional(),
    password: zod_1.z.string().min(1).max(100).optional()
});
