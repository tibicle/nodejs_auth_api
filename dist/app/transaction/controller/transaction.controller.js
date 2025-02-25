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
const addTransaction_service_1 = __importDefault(require("../services/addTransaction.service"));
const updateTransaction_service_1 = __importDefault(require("../services/updateTransaction.service"));
const listTransaction_service_1 = __importDefault(require("../services/listTransaction.service"));
const deleteTransaction_service_1 = __importDefault(require("../services/deleteTransaction.service"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class TransactionController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save transaction API
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  save transaction service
                //
                yield (0, addTransaction_service_1.default)(container);
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
    🚩 @uses : update transaction API
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update transaction service
                //
                yield (0, updateTransaction_service_1.default)(container);
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
    🚩 @uses : list transaction API
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list transaction service
                //
                yield (0, listTransaction_service_1.default)(container);
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
    🚩 @uses : delete transaction API
    🗓 @created : 27/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  delete transaction service
                //
                yield (0, deleteTransaction_service_1.default)(container);
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
exports.default = new TransactionController();
//# sourceMappingURL=transaction.controller.js.map