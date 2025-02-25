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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import services
const auth_helper_1 = __importDefault(require("../helper/auth.helper"));
const signup_services_1 = __importDefault(require("../services/signup.services"));
const createFolderWhileSignUp_service_1 = __importDefault(require("../services/createFolderWhileSignUp.service"));
const forgetPassword_service_1 = __importDefault(require("../services/forgetPassword.service"));
const resetPassword_sevice_1 = __importDefault(require("../services/resetPassword.sevice"));
const changePassword_service_1 = __importDefault(require("../services/changePassword.service"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
// Import Transformers
// Import Libraries
//Repo
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const http_status_codes_1 = require("http-status-codes");
const verifyEmail_service_1 = __importDefault(require("../services/verifyEmail.service"));
const resendVerifyEmail_1 = __importDefault(require("../services/resendVerifyEmail"));
class AuthController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Signup API
    🗓 @created : 16/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  Store the data in database
                //
                yield (0, signup_services_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
                //
                //  create folder into s3 bucket
                //
                yield (0, createFolderWhileSignUp_service_1.default)(container);
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
    🚩 @uses : login API
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        headers: req.headers
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                i18n_1.default.setLocale('nl');
                //
                // login the user based on passport Auth
                //
                yield passportAuth_1.default.loginUser(req, container);
                //
                // validate the login
                //
                yield authorization_1.default.validateLogin(container);
                //
                // Prepare the Payload for accessToken
                //
                container.output.result.access_token = yield auth_helper_1.default.generateAccessToken(container);
                //
                //  Prepare the Payload for refreshToken
                //
                container.output.result.refresh_token = yield auth_helper_1.default.generateRefreshToken(container);
                container.output.result.user = yield user_repo_1.default.getUserByUuid(container.derived.user.uuid);
                //
                // send the response
                //
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
    🚩 @uses : return refresh token and access token
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        logged_in_user: req.logged_in_user,
                        session_uuid: req.session_uuid
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // Prepare the Payload for accessToken
                //
                container.output.result.access_token = yield auth_helper_1.default.generateAccessToken(container);
                //
                //  Prepare the Payload for refreshToken
                //
                container.output.result.refresh_token = yield auth_helper_1.default.generateRefreshToken(container);
                //
                // send the response
                //
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : forget password API
    🗓 @created : 23/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  forget password service
                //
                yield (0, forgetPassword_service_1.default)(container);
                //
                // send the response
                //
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : reset password API
    🗓 @created : 23/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    reset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  reset password service
                //
                yield (0, resetPassword_sevice_1.default)(container);
                //
                // send the response
                //
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : change password API
    🗓 @created : 09/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        session_uuid: req.session_uuid
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //change password service
                //
                yield (0, changePassword_service_1.default)(container);
                //
                // send the response
                //
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : verify email
    🗓 @created : 09/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    emailVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        session_uuid: req.session_uuid
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //change email verified status service
                //
                yield (0, verifyEmail_service_1.default)(container);
                //
                // send the response
                //
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : resend verify email
    🗓 @created : 09/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    resendEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        session_uuid: req.session_uuid
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // resend verify email to the user
                //
                yield (0, resendVerifyEmail_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map