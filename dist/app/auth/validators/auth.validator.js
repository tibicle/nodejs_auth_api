"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singnUpSchema = exports.loginSchema = void 0;
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Config
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
const joi_1 = __importDefault(require("joi"));
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi_1.default.extend(joiPasswordExtendCore);
const loginSchema = {
    loginValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            email: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'valid characters')
                .messages({
                'string.pattern.name': 'Enter valid email'
            }),
            password: joi_1.default.string().required()
        })
    }),
    forgetPasswordValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            email: joi_1.default.string().trim().required()
        })
    }),
    resetValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            code: joi_1.default.string().required(),
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
            confirm_password: joi_1.default.any().valid(joi_1.default.ref('password')).required().options({ messages: { 'any.only': `${i18n_1.default.__("validation.not_match_password")}` } })
        })
    }),
    changePasswordValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            old_password: joi_1.default.string().required(),
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
            confirm_password: joi_1.default.any().valid(joi_1.default.ref('password')).required().options({ messages: { 'any.only': `${i18n_1.default.__("validation.not_match_password")}` } })
        })
    }),
    verifyEmail: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            code: joi_1.default.string().required()
        })
    }),
    resendEmail: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            email: joi_1.default.string().required()
        })
    }),
};
exports.loginSchema = loginSchema;
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : signup schema
🗓 @created : 16/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const singnUpSchema = {
    signUpValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            first_name: joi_1.default.string().regex(/^[a-zA-Z0-9 ]+$/).messages({
                'string.pattern.base': 'Special characters are not allowed in the first name field.'
            }).allow(null),
            last_name: joi_1.default.string().regex(/^[a-zA-Z0-9 ]+$/).messages({
                'string.pattern.base': 'Special characters are not allowed in the last name field.'
            }).allow(null),
            email: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'valid characters')
                .messages({
                'string.pattern.name': 'Enter valid email'
            }),
            organization_name: joi_1.default.string().allow(null),
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
            confirm_password: joi_1.default.any().valid(joi_1.default.ref('password')).required().options({ messages: { 'any.only': `${i18n_1.default.__("validation.not_match_password")}` } })
        })
    }),
};
exports.singnUpSchema = singnUpSchema;
//# sourceMappingURL=auth.validator.js.map