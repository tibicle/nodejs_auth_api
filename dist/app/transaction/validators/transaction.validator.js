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
const transactionSchema = {
    //
    //  body validation for add transaction API
    //
    addTransaction: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            user_uuid: joi_1.default.string().uuid().trim().allow(null),
            company_uuid: joi_1.default.string().uuid().trim().allow(null),
            subscription_uuid: joi_1.default.string().uuid().trim().required(),
            user_subscription_uuid: joi_1.default.string().uuid().trim().required(),
            file_uuid: joi_1.default.string().uuid().trim().allow(null),
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
        })
    })
};
exports.default = transactionSchema;
//# sourceMappingURL=transaction.validator.js.map