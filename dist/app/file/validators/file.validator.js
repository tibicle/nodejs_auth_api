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
🚩 @uses : create file schema for body validation
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const fileSchema = {
    //
    //  body validation for upload file API
    //
    uploadFile: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            type: joi_1.default.string().required(),
            upload_type: joi_1.default.string().required()
        })
    })
};
exports.default = fileSchema;
//# sourceMappingURL=file.validator.js.map