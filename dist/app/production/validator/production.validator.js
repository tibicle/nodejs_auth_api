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
🚩 @uses : create production schema for body validation
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const productionSchema = {
    //
    //  body validation for save hobbies API
    //
    saveProductionMedia: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            production_uuid: joi_1.default.string().uuid().required(),
            library_uuid: joi_1.default.array().items(joi_1.default.string().uuid()).allow(null)
        })
    }),
    //
    //  body validation for add layer API
    //
    addLayer: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            file_uuid: joi_1.default.string().uuid().trim().allow(null),
            layer_type: joi_1.default.string().valid('AUDIO', 'IMAGE', 'TEXT', 'VIDEO', 'GIF').required(),
            sequence_uuid: joi_1.default.string().uuid().trim().required()
        })
    }),
    //
    //  body validation for update layer API
    //
    //
    //  todo need to specify the key for validation once confirm with FE team
    //
    updateLayer: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            data: joi_1.default.array().items().allow(null)
        })
    }),
    //
    //  create new production
    //
    createProductionSchema: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            name: joi_1.default.string().regex(/^[a-zA-Z0-9 ]+$/).messages({
                'string.pattern.base': 'Special characters are not allowed in the name field.'
            }).required(),
            company_uuid: joi_1.default.string().uuid().trim().allow(null),
            status: joi_1.default.string().valid('IN_PROGRESS', 'COMPLETED', 'FAILED').allow(null),
            category: joi_1.default.string().allow(null),
            tag: joi_1.default.array().allow(null),
            description: joi_1.default.string().allow(null),
            deadline: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            project_type: joi_1.default.string().allow(null),
            production_idea: joi_1.default.string().allow(null),
            production_style: joi_1.default.string().allow(null),
            fredo: joi_1.default.array().items(joi_1.default.object({
                field_id: joi_1.default.required(),
                thread_id: joi_1.default.required()
            }).allow(null).messages({
                'object.base': 'details of fredo must be an object',
                'any.required': '{#label} is required' // Custom message for required fields
            }))
        })
    }),
    //
    //  update production
    //
    updateProductionSchema: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            name: joi_1.default.string().messages({
                'string.pattern.base': 'Special characters are not allowed in the name field.'
            }).allow(null),
            status: joi_1.default.string().allow(null).valid('IN_PROGRESS', 'COMPLETED', 'FAILED'),
            category: joi_1.default.string().allow(null),
            tag: joi_1.default.array().allow(null),
            description: joi_1.default.string().allow(null),
            deadline: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            project_type: joi_1.default.string().allow(null),
            production_idea: joi_1.default.string().allow(null),
            production_style: joi_1.default.string().allow(null),
        })
    }),
    //
    //  delete production 
    //
    deleteProduction: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            production_uuid: joi_1.default.alternatives().try(joi_1.default.string().required(), joi_1.default.array().items(joi_1.default.string()).required())
        })
    }),
    //
    //  list production
    //
    productionList: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            from: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            to: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null)
        })
    }),
    //
    //  update sequence
    //
    updateSequence: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            sequence_uuid: joi_1.default.string().uuid().trim().required(),
            name: joi_1.default.string().required(),
            target_audience: joi_1.default.string().allow(null),
            dead_line: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            script: joi_1.default.string().allow(null),
            project_planning: joi_1.default.string().allow(null),
            status: joi_1.default.string().allow(null).valid('PRE_PRODUCTION', 'PRODUCTION', 'COMPLETED', 'EXPORTED')
        })
    }),
    //
    //  delete sequence
    //
    deleteSequence: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            sequence_uuid: joi_1.default.string().uuid().trim().required(),
            title: joi_1.default.string().required()
        })
    }),
    //
    //  get layer validation
    //
    getLayer: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            sequence_uuid: joi_1.default.string().uuid().trim().required()
        })
    }),
    //
    //  create production sequence
    //
    createSequence: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            name: joi_1.default.string().allow(null),
            target_audience: joi_1.default.string().allow(null),
            dead_line: joi_1.default.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
            script: joi_1.default.string().allow(null),
            project_planning: joi_1.default.string().allow(null),
            status: joi_1.default.string().allow(null).valid('PRE_PRODUCTION', 'PRODUCTION', 'COMPLETED', 'EXPORTED')
        })
    }),
    //
    //  update sequence status
    //
    updateSequenceStatus: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            sequence_uuid: joi_1.default.string().uuid().trim().required(),
            status: joi_1.default.string().allow(null).valid('PRE_PRODUCTION', 'PRODUCTION', 'COMPLETED', 'EXPORTED')
        })
    }),
    //
    //  list production member
    //
    productionMember: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            production_uuid: joi_1.default.string().uuid().trim().required()
        })
    }),
    //
    //  validation of sequence uuid
    //
    updateAspectRatio: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        params: joi_1.default.object().keys({
            sequence_uuid: joi_1.default.string().uuid().trim().required()
        }),
        body: joi_1.default.object().keys({
            aspect_ratio: joi_1.default.string().required().valid("16:9", "9:16", "1:1", "1.19:1", "4:5", "5:4")
        })
    })
};
exports.default = productionSchema;
//# sourceMappingURL=production.validator.js.map