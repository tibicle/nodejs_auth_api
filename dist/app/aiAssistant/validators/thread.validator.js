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
* 😎 @author : Ekta Patel
* 🚩 @uses : thread validation
* 🗓 Created : 01/10/2024
*/
const threadValidatorSchema = {
    threadValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            field_id: joi.string().required(),
            company_uuid: joi.string().trim().allow(null),
            production_uuid: joi.string().uuid().trim().allow(null),
            production_name: joi.string().trim().allow(null),
            production_description: joi.string().trim().allow(null),
            message: joi.string().trim(),
            thread_id: joi.string().allow(null)
        })
    }),
    threadIdValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi.object().keys({
            production_uuid: joi.string().uuid().trim().allow(null),
            company_uuid: joi.string().uuid().allow(null),
            field_id: joi.string().allow(null),
            thread_id: joi.string().allow(null)
        })
    }),
    kioskValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            message: joi.string().trim().required(),
            thread_id: joi.string().allow(null)
        })
    }),
};
exports.default = threadValidatorSchema;
//# sourceMappingURL=thread.validator.js.map