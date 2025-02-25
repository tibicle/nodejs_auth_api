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
const saveStaticPage_service_1 = __importDefault(require("../services/saveStaticPage.service"));
const updateStaticPage_service_1 = __importDefault(require("../services/updateStaticPage.service"));
const listStaticPageDetails_service_1 = __importDefault(require("../services/listStaticPageDetails.service"));
const getStaticPageDetailsByUuid_service_1 = __importDefault(require("../services/getStaticPageDetailsByUuid.service"));
const updateStaticPageStatus_service_1 = __importDefault(require("../services/updateStaticPageStatus.service"));
// Import Middleware
// Import Controllers
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class StaticPageController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : To save static page
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveStaticPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // save static page service
                //
                yield (0, saveStaticPage_service_1.default)(container);
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
    🚩 @uses : list static page details API
    🗓 @created : 05/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listStaticPageDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list static page details service
                //
                yield (0, listStaticPageDetails_service_1.default)(container);
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
    🚩 @uses : update static page
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaticPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update static page service
                //
                yield (0, updateStaticPage_service_1.default)(container);
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
    🚩 @uses : get static page details by uuid
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getStaticPageDetailsByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get static page details by uuid service
                //
                yield (0, getStaticPageDetailsByUuid_service_1.default)(container);
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
    🚩 @uses : update static page status
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaticPageStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update static page details service
                //
                yield (0, updateStaticPageStatus_service_1.default)(container);
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
exports.default = new StaticPageController();
//# sourceMappingURL=staticPage.controller.js.map