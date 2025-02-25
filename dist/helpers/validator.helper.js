"use strict";
// Import Config
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
exports.sequenceUuidSchema = exports.userSubscriptionUuidSchema = exports.productionUuidSchema = exports.getFileErrors = exports.getErrors = exports.userUuidSchema = exports.uuidSchema = exports.paginationSchema = exports.validator = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const joi = require('@hapi/joi');
const validator = (schema) => {
    return (req, res, next) => {
        var errors = {};
        const rules = schema.validate(req);
        if (rules.error) {
            var error = rules.error.details;
            var firstError = error[0].context.key;
            for (var e of error) {
                let key = e.context.key;
                let label = e.context.label;
                errors[key] = e.message.replace(/['"]+/g, '').replace('body.', '');
            }
            return res.status(http_status_codes_1.default.BAD_REQUEST).send({
                status: "error",
                message: errors[firstError],
                errors,
            });
        }
        else {
            next();
        }
    };
};
exports.validator = validator;
const paginationSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    query: joi.object().keys({
        per_page: joi.string().allow(null),
        page: joi.string().allow(null)
    })
});
exports.paginationSchema = paginationSchema;
//
//validation of uuid
//
const uuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    params: joi.object().keys({
        uuid: joi.string().uuid().trim().required()
    })
});
exports.uuidSchema = uuidSchema;
//
//validation of userSubscriptionUuid
//
const userSubscriptionUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    params: joi.object().keys({
        user_subscription_uuid: joi.string().uuid().trim().required()
    })
});
exports.userSubscriptionUuidSchema = userSubscriptionUuidSchema;
//
//validation of user uuid
//
const userUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    params: joi.object().keys({
        user_uuid: joi.string().uuid().trim().required()
    })
});
exports.userUuidSchema = userUuidSchema;
//
// get the errors
//
const getErrors = (rules) => __awaiter(void 0, void 0, void 0, function* () {
    var errors = {};
    if (rules.error) {
        for (var e of rules.error.details) {
            let key = e.context.label;
            errors[key] = e.message.replace(/['"]+/g, '');
        }
    }
    return errors;
});
exports.getErrors = getErrors;
//
// get the file errors
//
const getFileErrors = (rules) => __awaiter(void 0, void 0, void 0, function* () {
    var errors = [];
    if (rules.error) {
        for (var e of rules.error.details) {
            let errMessage = e.message.replace(/['"]+/g, '') + ' on row number ' + (e.path[0] + 2);
            errors.push(errMessage.split('.')[1]);
        }
    }
    return errors;
});
exports.getFileErrors = getFileErrors;
//
//  validation of production uuid
//
const productionUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    params: joi.object().keys({
        production_uuid: joi.string().uuid().trim().required()
    })
});
exports.productionUuidSchema = productionUuidSchema;
//
//  validation of production uuid
//
const sequenceUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    params: joi.object().keys({
        sequence_uuid: joi.string().uuid().trim().required()
    })
});
exports.sequenceUuidSchema = sequenceUuidSchema;
//# sourceMappingURL=validator.helper.js.map