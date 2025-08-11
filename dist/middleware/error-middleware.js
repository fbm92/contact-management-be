"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleWare = void 0;
const zod_1 = require("zod");
const response_error_1 = require("../error/response-error");
const errorMiddleWare = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof zod_1.ZodError) {
        const err = JSON.parse(error.message);
        const result = [];
        for (let i = 0; i < err.length; i++) {
            result.push({
                message: err[i].message,
                path: err[i].path[0]
            });
        }
        res.status(400).json({
            errors: result,
        });
    }
    else if (error instanceof response_error_1.ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        });
    }
    else {
        res.status(500).json({
            errors: error.message,
        });
    }
});
exports.errorMiddleWare = errorMiddleWare;
