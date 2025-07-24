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
exports.ContactService = void 0;
const contact_model_1 = require("../model/contact-model");
const contact_validation_1 = require("../validation/contact-validation");
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ContactService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.CREATE, request);
            const record = Object.assign(Object.assign({}, createRequest), { username: user.username });
            const result = yield database_1.prismaClient.contact.create({
                data: record
            });
            return (0, contact_model_1.toContactResponse)(result);
        });
    }
    static checkContactExist(username, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield database_1.prismaClient.contact.findUnique({
                where: {
                    id: contactId,
                    username: username
                }
            });
            if (!contact) {
                throw new response_error_1.ResponseError(404, "CONTACT NOT FOUND");
            }
            return contact;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.checkContactExist(user.username, id);
            return (0, contact_model_1.toContactResponse)(result);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.UPDATE, request);
            yield this.checkContactExist(user.username, updateRequest.id);
            const result = yield database_1.prismaClient.contact.update({
                where: {
                    id: updateRequest.id,
                    username: user.username
                },
                data: updateRequest
            });
            return (0, contact_model_1.toContactResponse)(result);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkContactExist(user.username, id);
            const result = yield database_1.prismaClient.contact.delete({
                where: {
                    id: id,
                    username: user.username
                }
            });
            return (0, contact_model_1.toContactResponse)(result);
        });
    }
    static search(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(contact_validation_1.ContactValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            // CHECK IF NAME EXIST
            if (searchRequest.name) {
                filters.push({
                    OR: [
                        {
                            first_name: {
                                contains: searchRequest.name
                            },
                        },
                        {
                            last_name: {
                                contains: searchRequest.name
                            },
                        },
                    ],
                });
            }
            // CHECK IF PHONE EXIST AND PUSH
            if (searchRequest.phone) {
                filters.push({
                    phone: {
                        contains: searchRequest.phone
                    }
                });
            }
            // CHECK IF EMAIL EXIST AND PUSH
            if (searchRequest.email) {
                filters.push({
                    email: {
                        contains: searchRequest.email,
                    },
                });
            }
            const result = yield database_1.prismaClient.contact.findMany({
                where: {
                    username: user.username,
                    AND: filters,
                },
                take: searchRequest.size,
                skip: skip,
            });
            const total = yield database_1.prismaClient.contact.count({
                where: {
                    username: user.username,
                    AND: filters,
                },
            });
            return {
                data: result.map(contact => (0, contact_model_1.toContactResponse)(contact)),
                paging: {
                    current_page: searchRequest.page,
                    total_page: Math.ceil(total / searchRequest.size),
                    size: searchRequest.size
                }
            };
        });
    }
}
exports.ContactService = ContactService;
