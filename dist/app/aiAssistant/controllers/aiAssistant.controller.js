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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import services
const storeThread_service_1 = __importDefault(require("../services/storeThread.service"));
const getThread_service_1 = __importDefault(require("../services/getThread.service"));
const kioskApi_serivce_1 = __importDefault(require("../services/kioskApi.serivce"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class aiAssistantController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Ekta Patel
    🚩 @uses : store thread
    🗓 @created : 01/10/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    storeThread(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //service to store thread in db
                //
                yield (0, storeThread_service_1.default)(container);
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get thread controller
    * 🗓 Created : 01/10/2024
    */
    getThread(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //service to store thread in db
                //
                yield (0, getThread_service_1.default)(container);
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : kiosk API
    🗓 @created : 18/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    kioskApi(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                if (req.headers.authorization == undefined) {
                    const err = new Error(i18n_1.default.__('auth.token_required'));
                    err.statusCode = 401;
                    throw err;
                }
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    const kiosk_secret_token = req.headers.authorization.split(' ')[1];
                    if (kiosk_secret_token != constant_1.default.app.KIOSK_SECRET) {
                        const err = new Error(i18n_1.default.__('auth.invalid_token'));
                        err.statusCode = 401;
                        throw err;
                    }
                }
                //
                //  service kiosk api
                //
                yield (0, kioskApi_serivce_1.default)(container);
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new aiAssistantController();
//# sourceMappingURL=aiAssistant.controller.js.map