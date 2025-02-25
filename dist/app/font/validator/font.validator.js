"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontSchema = void 0;
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
const fontSchema = {
    // 
    //  body validation for save font API
    //
    saveFontValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            company_uuid: joi.string().uuid().trim().allow(null),
            title: joi.string().required(),
            details: joi.array().required()
        })
    }),
    //
    //  body validation for font status
    //
    fontStatusValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('ACTIVE', 'DEACTIVE')
        })
    }),
    //
    //  body validation for font status
    //
    updatefontValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            company_uuid: joi.string().uuid().trim().allow(null),
            title: joi.string().required(),
            details: joi.array().required()
        })
    })
};
exports.fontSchema = fontSchema;
//# sourceMappingURL=font.validator.js.map