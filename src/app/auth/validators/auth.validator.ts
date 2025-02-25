import i18n from "../../../config/i18n";
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

import joi from "joi";
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const loginSchema = {
    loginValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
                body: joi.object().keys({
                email: joi.string()
                .required()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'valid characters')
                .messages({
                    'string.pattern.name': 'Enter valid email'
                }),
                password: joi.string().required()
            })
        }),
        
    forgetPasswordValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
            body: joi.object().keys({
                email: joi.string().trim().required()
            })
        }),

    resetValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
            body: joi.object().keys({
                code:joi.string().required(),
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
                    'password.minOfUppercase': `${i18n.__("validation.uppercase")}`,
                    'password.minOfSpecialCharacters':`${i18n.__("validation.special_character")}`,
                    'password.minOfLowercase':`${i18n.__("validation.lowercase")}`,
                    'password.minOfNumeric':`${i18n.__("validation.number")}`,
                    'password.noWhiteSpaces': `${i18n.__("validation.white_space")}`,
                    'string.min': `${i18n.__("validation.min")}`,
                    'string.max': `${i18n.__("validation.max")}`,
                }),
                confirm_password: joi.any().valid(joi.ref('password')).required().options({ messages: { 'any.only': `${i18n.__("validation.not_match_password")}`} })

                })
        }),

    changePasswordValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
            body: joi.object().keys({
                old_password:joi.string().required(),
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
                    'password.minOfUppercase': `${i18n.__("validation.uppercase")}`,
                    'password.minOfSpecialCharacters':`${i18n.__("validation.special_character")}`,
                    'password.minOfLowercase':`${i18n.__("validation.lowercase")}`,
                    'password.minOfNumeric':`${i18n.__("validation.number")}`,
                    'password.noWhiteSpaces': `${i18n.__("validation.white_space")}`,
                    'string.min': `${i18n.__("validation.min")}`,
                    'string.max': `${i18n.__("validation.max")}`,
                }),
                confirm_password: joi.any().valid(joi.ref('password')).required().options({ messages: { 'any.only': `${i18n.__("validation.not_match_password")}`} })

                })
        }),
    verifyEmail: joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        body: joi.object().keys({
            code: joi.string().required()
        })
    }),
    resendEmail: joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        body: joi.object().keys({
            email: joi.string().required()
        })
    }),
        
};
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : signup schema
🗓 @created : 16/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const singnUpSchema={
    signUpValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
            body: joi.object().keys({
                first_name: joi.string().regex(/^[a-zA-Z0-9 ]+$/).messages({
                    'string.pattern.base': 'Special characters are not allowed in the first name field.'
                }).allow(null),
                last_name: joi.string().regex(/^[a-zA-Z0-9 ]+$/).messages({
                    'string.pattern.base': 'Special characters are not allowed in the last name field.'
                }).allow(null),
                email: joi.string()
                .required()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'valid characters')
                .messages({
                    'string.pattern.name': 'Enter valid email'
                }),
                organization_name:joi.string().allow(null),
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
                    'password.minOfUppercase': `${i18n.__("validation.uppercase")}`,
                    'password.minOfSpecialCharacters':`${i18n.__("validation.special_character")}`,
                    'password.minOfLowercase':`${i18n.__("validation.lowercase")}`,
                    'password.minOfNumeric':`${i18n.__("validation.number")}`,
                    'password.noWhiteSpaces': `${i18n.__("validation.white_space")}`,
                    'string.min': `${i18n.__("validation.min")}`,
                    'string.max': `${i18n.__("validation.max")}`,
                }),
                confirm_password: joi.any().valid(joi.ref('password')).required().options({ messages: { 'any.only': `${i18n.__("validation.not_match_password")}`} })

            })
        }),
}
export {loginSchema,singnUpSchema};