"use strict";
// Import Config
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Static
// Import Middleware
// Import Controllers
// Import Helpers
const validator_helper_1 = require("./validator.helper");
const response_helper_1 = __importDefault(require("./response.helper"));
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const joi = require('@hapi/joi');
class FileValidator {
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to validate the user uploaded file object
    * 🗓 Created : 16/6/2022
    */
    fileDataValidator(files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rules = yield joi.object().options({ abortEarly: false }).keys({
                    files: joi.array().items({
                        url: joi.string().required().trim(),
                        name: joi.string().required().trim(),
                        type: joi.string().required().trim()
                    }).required().min(1)
                }).validate(files);
                const errors = yield (0, validator_helper_1.getErrors)(rules);
                if (Object.keys(errors).length) {
                    yield response_helper_1.default.getValidationError(errors);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new FileValidator();
//# sourceMappingURL=fileValidator.helper.js.map