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
👑 @creator : Bhavya Nayak
🚩 @uses : dashboard body validation
🗓 @created : 02/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const dashboardValidatorSchema = {
    createTeamValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            name: joi.string().required(),
            about: joi.string().allow(null),
            company_uuid: joi.string().uuid().trim().required(),
            tag: joi.array().allow(null),
            file_uuid: joi.string().allow(null)
        })
    }),
    updateTeamValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            name: joi.string().required(),
            about: joi.string().allow(null),
            tag: joi.array().allow(null),
            file_uuid: joi.string().allow(null)
        })
    })
};
exports.default = dashboardValidatorSchema;
//# sourceMappingURL=dashboardvalidator.js.map