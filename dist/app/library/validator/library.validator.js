"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLibraryFile = exports.updateLibraryFileDetails = exports.libraryList = void 0;
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Transformers
// Import Libraries
// Import Thirdparty
const joi = require('@hapi/joi');
const libraryList = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
    query: joi.object().keys({
        type: joi.string().valid(constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST).allow(null),
        production_uuid: joi.when('type', {
            is: constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST,
            then: joi.string().uuid().required(),
            otherwise: joi.forbidden()
        }),
        from: joi.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null),
        to: joi.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).allow(null)
    })
});
exports.libraryList = libraryList;
const updateLibraryFileDetails = {
    updateLibraryFile: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi.object().keys({
            name: joi.string().messages({
                'string.pattern.base': 'Special characters are not allowed in the name field.'
            }).regex(/^[a-zA-Z0-9 ]+$/).trim().allow(null),
            description: joi.string().allow(null),
            tag: joi.array().allow(null)
        })
    })
};
exports.updateLibraryFileDetails = updateLibraryFileDetails;
const deleteLibraryFile = {
    //
    //  delete library 
    //
    deleteLibrary: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi.object().keys({
            library_uuid: joi.alternatives().try(joi.string().required(), joi.array().items(joi.string()).required())
        })
    })
};
exports.deleteLibraryFile = deleteLibraryFile;
//# sourceMappingURL=library.validator.js.map