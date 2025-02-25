"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPageSchema = void 0;
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
const staticPageSchema = {
    // 
    //  body validation for save static page API
    //
    saveStaticPageValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            title: joi.string().required(),
            description: joi.string().required()
        })
    }),
    //
    //  body validation for update static page API
    //
    updateStaticPageValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            static_page_uuid: joi.string().uuid().trim().required(),
            title: joi.string().required(),
            description: joi.string().required()
        })
    }),
    //
    //  body validation for static page status
    //
    staticPageStatusValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('ACTIVE', 'DEACTIVE')
        })
    })
};
exports.staticPageSchema = staticPageSchema;
//# sourceMappingURL=staticPage.validator.js.map