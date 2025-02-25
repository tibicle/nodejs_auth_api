"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
// Import Joi
const joi_1 = __importDefault(require("joi"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create export schema for export API body validation
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const exportSchema = {
    //
    //  body validation for save export details API
    //
    saveExportDetails: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            production_uuid: joi_1.default.string().uuid().required(),
            name: joi_1.default.string().allow(null),
            quality: joi_1.default.string().required(),
            fps: joi_1.default.string().allow(null),
            sequence_uuid: joi_1.default.string().uuid().required(),
            company_uuid: joi_1.default.string().uuid().allow(null),
            user_uuid: joi_1.default.string().uuid().allow(null)
        })
    }),
    //
    //  body validation for export file update status API
    //
    updateExportStatus: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            status: joi_1.default.string().valid('EXPORTING', 'COMPLETED', 'FAILED').required()
        })
    }),
    //
    //  body validation for export file update API
    //
    updateExport: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            name: joi_1.default.string().allow(null),
            seo_title: joi_1.default.string().allow(null),
            description: joi_1.default.string().allow(null)
        })
    }),
    //
    //  validate embed code
    //
    embedVideo: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            embed_code: joi_1.default.string().required()
        })
    }),
    //
    //  validate hls video create
    //
    hlsVideoCreate: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            export_uuid: joi_1.default.string().uuid().required(),
        })
    })
};
exports.default = exportSchema;
//# sourceMappingURL=export.validator.js.map