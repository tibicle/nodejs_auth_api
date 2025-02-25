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
// Import Static
// Import Middleware
// Import Controllers
// Import Library
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
// Import  Services
const listSubscription_service_1 = __importDefault(require("../services/listSubscription.service"));
const getSubscriptionByUuid_service_1 = __importDefault(require("../services/getSubscriptionByUuid.service"));
const buySubscription_service_1 = __importDefault(require("../services/buySubscription.service"));
const getCurrentSubscription_service_1 = __importDefault(require("../services/getCurrentSubscription.service"));
const listAllUsersSubscription_service_1 = __importDefault(require("../services/listAllUsersSubscription.service"));
const getUserSubscriptionDetailsByUuid_service_1 = __importDefault(require("../services/getUserSubscriptionDetailsByUuid.service"));
const addOnSubscription_service_1 = __importDefault(require("../services/addOnSubscription.service"));
const renewSubscription_service_1 = __importDefault(require("../services/renewSubscription.service"));
const upgradeSubscription_service_1 = __importDefault(require("../services/upgradeSubscription.service"));
const cancelSubscription_service_1 = __importDefault(require("../services/cancelSubscription.service"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class SubscriptionController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all subscription API
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get all subscriptions service
                //
                yield (0, listSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : get subscription by uuid
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get subscription by uuid service
                //
                yield (0, getSubscriptionByUuid_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : buy subscription API
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    buySubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  buy subscription service
                //
                yield (0, buySubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : get current subscription
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCurrentSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get current subscription service
                //
                yield (0, getCurrentSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : get all user's last subscription
    🗓 @created : 23/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listAllUsersSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list user subscription service
                //
                yield (0, listAllUsersSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : get user subscription details by uuid
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserSubscriptionDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get user subscription details by uuid service
                //
                yield (0, getUserSubscriptionDetailsByUuid_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : add on subscription API
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    addOnSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  add on subscription service
                //
                yield (0, addOnSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : renew subscription API
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    renewSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  renew subscription service
                //
                yield (0, renewSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : upgrade subscription API
    🗓 @created : 05/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    upgradeSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  upgrade subscription service
                //
                yield (0, upgradeSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : cancel subscription API
    🗓 @created : 05/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    cancelSubscription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user,
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  cancel subscription service
                //
                yield (0, cancelSubscription_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new SubscriptionController();
//# sourceMappingURL=subscription.controller.js.map