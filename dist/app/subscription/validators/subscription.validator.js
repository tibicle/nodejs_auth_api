"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Joi
const joi_1 = __importDefault(require("joi"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : created subscription schema for body validation
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const subscriptionSchema = {
    //
    //  body validation for buying subscription API
    //
    buySubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            subscription_uuid: joi_1.default.string().uuid().trim().required(),
            user_uuid: joi_1.default.string().uuid().trim().allow(null),
            company_uuid: joi_1.default.string().uuid().trim().allow(null)
        })
    }),
    //
    //  query validation for get current subscription details
    //
    getCurrentSubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            user_uuid: joi_1.default.string().uuid().trim().allow(null),
            company_uuid: joi_1.default.string().uuid().trim().allow(null)
        })
    }),
    //
    //  body validation for add on subscription API
    //
    addOnSubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            user_subscription_uuid: joi_1.default.string().uuid().trim().required(),
            file_uuid: joi_1.default.string().uuid().trim().allow(null),
            start_date: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).required(),
            end_date: joi_1.default.date().min(joi_1.default.ref('start_date')).messages({ 'date.format': `Date format is YYYY-MM-DD` }).required(),
            amount: joi_1.default.number().required(),
            total_minutes: joi_1.default.number().required(),
            user_access: joi_1.default.string().allow(null),
            storage: joi_1.default.string().required()
        })
    }),
    //
    //  body validation for renew subscription API
    //
    renewSubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            subscription_uuid: joi_1.default.string().uuid().trim().required(),
            user_subscription_uuid: joi_1.default.string().uuid().trim().required(),
            file_uuid: joi_1.default.string().uuid().trim().allow(null),
            user_uuid: joi_1.default.string().uuid().trim().allow(null),
            company_uuid: joi_1.default.string().uuid().trim().allow(null),
            start_date: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            end_date: joi_1.default.date().min(joi_1.default.ref('start_date')).messages({
                'date.min': 'End date must be greater than or equal to the start date',
                'date.format': 'Date format is YYYY-MM-DD'
            }).allow(null),
            next_billing_date: joi_1.default.date().iso().valid(joi_1.default.ref('end_date')).messages({
                'date.format': `Date format is YYYY-MM-DD`,
                'any.only': `Next billing date must be equal to end date`
            }).allow(null),
            amount: joi_1.default.number().allow(null),
            total_minutes: joi_1.default.number().allow(null),
            storage: joi_1.default.string().allow(null),
            user_access: joi_1.default.string().allow(null),
            panel_type: joi_1.default.string().valid('ADMIN', 'USER').required(),
        })
    }),
    //
    //  body validation for upgrade subscription API
    //
    upgradeSubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            subscription_uuid: joi_1.default.string().uuid().trim().required(),
            user_subscription_uuid: joi_1.default.string().uuid().trim().required(),
            file_uuid: joi_1.default.string().uuid().trim().allow(null),
            user_uuid: joi_1.default.string().uuid().trim().allow(null),
            company_uuid: joi_1.default.string().uuid().trim().allow(null),
            start_date: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).required(),
            end_date: joi_1.default.date().min(joi_1.default.ref('start_date')).messages({ 'date.format': `Date format is YYYY-MM-DD` }).required(),
            next_billing_date: joi_1.default.date().iso().valid(joi_1.default.ref('end_date')).messages({
                'date.format': `Date format is YYYY-MM-DD`,
                'any.only': `Next billing date must be equal to end date`
            }).required(),
            amount: joi_1.default.number().required(),
            total_minutes: joi_1.default.number().required(),
            storage: joi_1.default.string().required(),
            user_access: joi_1.default.string().allow(null)
            // panel_type: joi.string().valid('ADMIN','USER').required(),
        })
    }),
    //
    //  body validation for cancel subscription API
    //
    cancelSubscription: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            user_subscription_uuid: joi_1.default.string().uuid().trim().required()
        })
    })
};
exports.default = subscriptionSchema;
//# sourceMappingURL=subscription.validator.js.map