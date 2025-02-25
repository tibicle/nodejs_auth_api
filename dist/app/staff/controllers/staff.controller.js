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
// Import Middleware
// Import Controllers
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
// Import Transformers
// Import Libraries
// Import Models
// Import service
const addStaff_service_1 = __importDefault(require("../services/addStaff.service"));
const listStaffDetails_service_1 = __importDefault(require("../services/listStaffDetails.service"));
const getStaffRoles_service_1 = __importDefault(require("../services/getStaffRoles.service"));
const updateStaff_service_1 = __importDefault(require("../services/updateStaff.service"));
const getStaffDetailsByUuid_service_1 = __importDefault(require("../services/getStaffDetailsByUuid.service"));
const updateStaffStatus_service_1 = __importDefault(require("../services/updateStaffStatus.service"));
const http_status_codes_1 = require("http-status-codes");
class StaffController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : To add staff
    🗓 @created : 15/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    addStaff(req, res, next) {
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
                //  add staff details service
                //
                yield (0, addStaff_service_1.default)(container);
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
    🚩 @uses : list staff details API
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listStaffDetails(req, res, next) {
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
                //  list staff details service
                //
                yield (0, listStaffDetails_service_1.default)(container);
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
    🚩 @uses : get staff roles
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getStaffRoles(req, res, next) {
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
                //  get staff roles service
                //
                yield (0, getStaffRoles_service_1.default)(container);
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
    🚩 @uses : update staff details
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaff(req, res, next) {
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
                //  update staff details service
                //
                yield (0, updateStaff_service_1.default)(container);
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
    🚩 @uses : get staff details by uuid
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getStaffDetailsByUuid(req, res, next) {
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
                //  get staff details by uuid service
                //
                yield (0, getStaffDetailsByUuid_service_1.default)(container);
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
    🚩 @uses : update staff status
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaffStatus(req, res, next) {
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
                //  update staff details service
                //
                yield (0, updateStaffStatus_service_1.default)(container);
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
exports.default = new StaffController();
//# sourceMappingURL=staff.controller.js.map