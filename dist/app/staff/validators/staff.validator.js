"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchema = void 0;
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Validators
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const joi = require('@hapi/joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);
const staffSchema = {
    // 
    //  body validation for add staff details API
    //
    addStaffValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string()
                .required()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'valid characters')
                .messages({
                'string.pattern.name': 'Enter valid email'
            }),
            role_uuid: joi.string().uuid().trim().required(),
            mobile_no: joi.string().min(9).max(13).allow(null),
            password: joiPassword
                .string()
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .min(8)
                .max(24)
                .noWhiteSpaces()
                .required()
                .messages({
                'password.minOfUppercase': `${i18n_1.default.__("validation.uppercase")}`,
                'password.minOfSpecialCharacters': `${i18n_1.default.__("validation.special_character")}`,
                'password.minOfLowercase': `${i18n_1.default.__("validation.lowercase")}`,
                'password.minOfNumeric': `${i18n_1.default.__("validation.number")}`,
                'password.noWhiteSpaces': `${i18n_1.default.__("validation.white_space")}`,
                'string.min': `${i18n_1.default.__("validation.min")}`,
                'string.max': `${i18n_1.default.__("validation.max")}`,
            }),
            confirm_password: joi.any().valid(joi.ref('password')).required().options({ messages: { 'any.only': `${i18n_1.default.__("validation.not_match_password")}` } })
        })
    }),
    //
    //  body validation for update staff details API
    //
    updateStaffValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            user_uuid: joi.string().uuid().trim().required(),
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string().email().required(),
            role_uuid: joi.string().uuid().trim().required(),
            mobile_no: joi.string().min(9).max(13).allow(null),
        })
    }),
    //
    //  body validation for staff status
    //
    staffStatusValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('ACTIVE', 'DEACTIVE')
        })
    })
};
exports.staffSchema = staffSchema;
//# sourceMappingURL=staff.validator.js.map