"use strict";
// Import Config
Object.defineProperty(exports, "__esModule", { value: true });
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
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : company validator using joi
🗓 @created : 16/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validCompanySchema = {
    companyValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi.object().keys({
            organization_name: joi.string().required(),
            email: joi.string().required()
        })
    }),
    updateCompanyValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            company_name: joi.string().allow(null),
            vat_id: joi.string().allow(null),
            company_address: joi.string().allow(null),
            company_profile_bio: joi.string().max(200).allow(null).messages({
                'string.max': 'Company profile bio must not exceed 200 characters.',
                'string.base': 'Company profile bio must be a string.',
                'any.required': 'Company profile bio is required.',
            }),
            website_url: joi.string().max(100)
                .uri({ scheme: ['http', 'https'] })
                .messages({
                'string.max': 'The website URL must be less than or equal to 100 characters',
                'string.uri': 'The website URL must be a valid URL with http or https'
            }),
            mission: joi.string().max(500).allow(null),
            activity: joi.string().max(500).allow(null),
            objective: joi.string().max(500).allow(null),
            preference: joi.string().allow(null),
            file_uuid: joi.string().allow(null),
        })
    }),
    companyProfile: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            company_uuid: joi.string().uuid().trim().required(),
            company_profile_bio: joi.string().max(200).allow(null).messages({
                'string.max': 'Company profile bio must not exceed 200 characters.',
                'string.base': 'Company profile bio must be a string.',
                'any.required': 'Company profile bio is required.',
            }),
            website_url: joi.string().max(100)
                .uri({ scheme: ['http', 'https'] })
                .messages({
                'string.max': 'The website URL must be less than or equal to 100 characters',
                'string.uri': 'The website URL must be a valid URL with http or https'
            }),
            mission: joi.string().max(500).allow(null),
            activity: joi.string().max(500).allow(null),
            objective: joi.string().max(500).allow(null),
            preference: joi.string().allow(null),
            file_uuid: joi.string().allow(null),
        })
    }),
    companyLogo: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi.object().keys({
            file_uuid: joi.string().uuid().trim().required(),
        })
    })
};
exports.default = validCompanySchema;
//# sourceMappingURL=company.validator.js.map