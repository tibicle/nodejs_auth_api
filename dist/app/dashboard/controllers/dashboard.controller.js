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
// Import services
const getDashboardTeamList_1 = __importDefault(require("../services/getDashboardTeamList"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class DashboardController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get dashboard team list
    🗓 @created : 02/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getDashboardTeamList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        auth_token: req.auth_token,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get dashboard team list service
                //
                yield (0, getDashboardTeamList_1.default)(container);
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
exports.default = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map