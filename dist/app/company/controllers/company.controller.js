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
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
// Import Transformers
// Import Libraries
// Import Service
const company_verify_services_1 = __importDefault(require("../services/company.verify.services"));
const companyDetailsByUuid_service_1 = __importDefault(require("../services/companyDetailsByUuid.service"));
const http_status_codes_1 = require("http-status-codes");
const updateCompanyDetials_service_1 = __importDefault(require("../services/updateCompanyDetials.service"));
const createCompanyProfile_service_1 = __importDefault(require("../services/createCompanyProfile.service"));
const deleteCompanyLogo_service_1 = __importDefault(require("../services/deleteCompanyLogo.service"));
class CompanyController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : company verify API
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    CompanyVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //Check company present in database or not
                //
                yield (0, company_verify_services_1.default)(container);
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
    🚩 @uses : company details by uuid API
    🗓 @created : 15/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get company details by uuid service
                //
                yield (0, companyDetailsByUuid_service_1.default)(container);
                //
                //  send the response
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
    🚩 @uses : update company detials
    🗓 @created : 16/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateCompanyDetails(req, res, next) {
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
                        result: {}
                    }
                };
                //
                //  update company detials service
                //
                yield (0, updateCompanyDetials_service_1.default)(container);
                //
                //  send the response
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
    🚩 @uses : create company profile
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createCompanyProfile(req, res, next) {
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
                        result: {}
                    }
                };
                //
                //  create company profile
                //
                yield (0, createCompanyProfile_service_1.default)(container);
                //
                //  send the response
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
   🚩 @uses : delete company logo
   🗓 @created : 16/10/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    deleteCompanyLogo(req, res, next) {
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
                        result: {}
                    }
                };
                //
                //  delete company logo
                //
                yield (0, deleteCompanyLogo_service_1.default)(container);
                //
                //  send the response
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
exports.default = new CompanyController();
//# sourceMappingURL=company.controller.js.map