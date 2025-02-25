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
const permissionSchema = {
    updatePermission: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().options({ abortEarly: false }).keys({
            action_code: joi.string().required().trim(),
            is_allow: joi.boolean().required()
        })
    })
};
exports.default = permissionSchema;
//# sourceMappingURL=userPermission.validator.js.map