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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const response_error_1 = require("../error/response-error");
const user_model_1 = require("../model/user-model");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserService {
    // REGISTER SERVICE
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerUser = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const totalSameUser = yield database_1.prismaClient.user.count({
                where: {
                    username: registerUser.username
                }
            });
            if (totalSameUser != 0) {
                throw new response_error_1.ResponseError(400, 'username already exist');
            }
            registerUser.password = yield bcrypt_1.default.hash(registerUser.password, 10);
            const user = yield database_1.prismaClient.user.create({
                data: registerUser
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    // LOGIN SERVICE
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            let user = yield database_1.prismaClient.user.findUnique({
                where: {
                    username: loginRequest.username
                }
            });
            if (!user) {
                throw new response_error_1.ResponseError(401, "Username or Password is Wrongg");
            }
            const isValidPassword = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!isValidPassword) {
                throw new response_error_1.ResponseError(401, "Username or Password is Wrong");
            }
            user = yield database_1.prismaClient.user.update({
                where: {
                    username: loginRequest.username
                },
                data: {
                    token: (0, uuid_1.v4)()
                }
            });
            console.log(user);
            const response = (0, user_model_1.toUserResponse)(user);
            response.token = user.token;
            console.log(response);
            return response;
        });
    }
    static get(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user);
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUserRequest = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, request);
            if (updateUserRequest.name) {
                user.name = updateUserRequest.name;
            }
            if (updateUserRequest.password) {
                user.password = yield bcrypt_1.default.hash(updateUserRequest.password, 10);
            }
            const result = yield database_1.prismaClient.user.update({
                where: {
                    username: user.username
                },
                data: user
            });
            return (0, user_model_1.toUserResponse)(result);
        });
    }
    static logout(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.prismaClient.user.update({
                where: {
                    username: user.username
                },
                data: {
                    token: null
                }
            });
            return (0, user_model_1.toUserResponse)(result);
        });
    }
}
exports.UserService = UserService;
