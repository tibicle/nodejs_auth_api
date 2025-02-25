"use strict";
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
const constant_1 = __importDefault(require("../config/constant"));
const i18n_1 = __importDefault(require("../config/i18n"));
//import { configureI18n } from '../config/i18n';
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Validators
// Import Helpers
const response_helper_1 = __importDefault(require("../helpers/response.helper"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Authorization {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate login
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.logged_in_user) {
                    if (!req.secretKey && !req.embed_token) {
                        const err = new Error(i18n_1.default.__('un_authorized'));
                        err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                        throw err;
                    }
                }
                next();
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate login
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateLogin(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (container.output && container.output.error && Object.keys(container.output.error).length) {
                    const err = new Error(container.output.error.message);
                    err.statusCode = container.output.error.code;
                    throw err;
                }
                else {
                    if (!container.derived.user) {
                        const err = new Error(i18n_1.default.__('auth.wrong_credentials'));
                        err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                        throw err;
                    }
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate refresh token
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    isValidToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.logged_in_user || req.logged_in_user.token_type != constant_1.default.app.TOKEN_TYPE.refresh_token) {
                    const err = new Error(i18n_1.default.__('auth.un_authorized'));
                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                    throw err;
                }
                next();
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new Authorization();
//# sourceMappingURL=authorization.js.map