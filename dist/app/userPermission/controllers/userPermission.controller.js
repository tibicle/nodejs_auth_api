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
// Import services
const getUserPermission_service_1 = __importDefault(require("../services/getUserPermission.service"));
const upsertUserPermission_service_1 = __importDefault(require("../services/upsertUserPermission.service"));
const getUserAllowedPermission_service_1 = __importDefault(require("../services/getUserAllowedPermission.service"));
// Import Middleware
// Import Controllers
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class UserPermissionController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    userPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: {
                            uuid: req.logged_in_user.uuid
                        },
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {},
                        meta: {}
                    }
                };
                //
                // get the user permission
                //
                yield (0, getUserPermission_service_1.default)(container);
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
    🚩 @uses : to get user permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    userPermissionByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {},
                        meta: {}
                    }
                };
                //
                // get the user permission
                //
                yield (0, getUserPermission_service_1.default)(container);
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
    🚩 @uses : upsert user permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    upsertUserPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {},
                        meta: {}
                    }
                };
                //
                // upsert user permission service
                //
                yield (0, upsertUserPermission_service_1.default)(container);
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
    🚩 @uses : user allowed permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    userAllowedPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {},
                        meta: {}
                    }
                };
                //
                // get user allowed permission service
                //
                yield (0, getUserAllowedPermission_service_1.default)(container);
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
exports.default = new UserPermissionController();
//# sourceMappingURL=userPermission.controller.js.map