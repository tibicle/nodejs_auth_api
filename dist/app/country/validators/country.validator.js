"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryValidator = void 0;
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
const countryValidator = {
    // 
    // dropdown validation
    //
    dropdown: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi.object().keys({
            dropdown: joi.boolean().allow(null)
        })
    })
};
exports.countryValidator = countryValidator;
//# sourceMappingURL=country.validator.js.map