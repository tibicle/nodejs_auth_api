'use strict';
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
// Import Config
const i18n_1 = __importDefault(require("../config/i18n"));
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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ResponseHelper {
    //
    // Success Format the response
    //
    successResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseFormat = {
                status: 'success',
                data: data.result
            };
            if ('meta' in data) {
                responseFormat.meta = data.meta;
            }
            if ('message' in data) {
                responseFormat.message = data.message;
            }
            return responseFormat;
        });
    }
    //
    // Format Validation error response
    //
    validationErrorResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data) {
                let validationErrorFormat = {
                    status: 'error',
                };
                if ('validationErrors' in data) {
                    validationErrorFormat.errors = data.validationErrors;
                }
                if ('message' in data) {
                    validationErrorFormat.message = data.message;
                }
                return validationErrorFormat;
            }
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to get the statusCode
    * 🗓 Created : 21/4/2022
    */
    getStatusCode(error) {
        return __awaiter(this, void 0, void 0, function* () {
            return !error || isNaN(error.statusCode) ? 500 : error.statusCode;
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to format the validation errors
    * 🗓 Created : 22/4/2022
    */
    getValidationError(errors) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errFormat = new Error(i18n_1.default.__('validation_error'));
                errFormat.validationErrors = errors;
                errFormat.statusCode = http_status_codes_1.default.BAD_REQUEST;
                throw errFormat;
            }
            catch (err) {
                throw err;
            }
        });
    }
    //
    //	get the firebase error response
    //
    getFirebaseError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorFormat = {
                status: "error",
                message: error.message
            };
            if ("response" in error &&
                "data" in error.response) {
                switch (error.response.data.error.message) {
                    case 'EMAIL_EXISTS':
                        errorFormat.message = i18n_1.default.__('firebase_auth.email_exist');
                        break;
                    case 'INVALID_CODE':
                        errorFormat.message = i18n_1.default.__('auth.invalid_code');
                        break;
                    case 'INVALID_SESSION_INFO':
                        errorFormat.message = i18n_1.default.__('auth.invalid_session_info');
                        break;
                    default:
                        errorFormat.message = error.response.data.error.message;
                        break;
                }
            }
            return errorFormat;
        });
    }
}
exports.default = new ResponseHelper();
//# sourceMappingURL=response.helper.js.map