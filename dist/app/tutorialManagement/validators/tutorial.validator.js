"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorialSchema = void 0;
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
const tutorialSchema = {
    // 
    //  body validation for save tutorial API
    //
    saveTutorialValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            title: joi.string().required(),
            description: joi.string().required(),
            tag: joi.array().allow(null),
            access_type: joi.string().valid('PUBLIC', 'SUBSCRIPTION', 'PREMIUM').allow(null),
            article_type: joi.string().valid('MODULE', 'TUTORIAL').allow(null),
            related_article: joi.array().allow(null),
            thumbnail_uuid: joi.string().uuid().trim().allow(null),
            cover_uuid: joi.string().uuid().trim().allow(null),
            author: joi.string().allow(null)
        })
    }),
    //
    //  body validation for update tutorial API
    //
    updateTutorialValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            tutorial_uuid: joi.string().uuid().trim().required(),
            title: joi.string().required(),
            description: joi.string().required()
        })
    }),
    //
    //  body validation for tutorial status
    //
    tutorialStatusValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('ACTIVE', 'DEACTIVE')
        })
    }),
    //
    //  body validation for publish tutorial
    //
    publishTutorialValidator: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            status: joi.string().valid('ACTIVE', 'DEACTIVE')
        })
    })
};
exports.tutorialSchema = tutorialSchema;
//# sourceMappingURL=tutorial.validator.js.map