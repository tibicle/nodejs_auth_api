"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogSchema = void 0;
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
const errorLogSchema = {
    //
    //  body validation for log status and comment
    //
    errorLogStatusValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('OPEN', 'RESOLVED', 'CLOSE').required(),
            comment: joi.string().allow(null)
        })
    })
};
exports.errorLogSchema = errorLogSchema;
//# sourceMappingURL=errorLog.validator.js.map