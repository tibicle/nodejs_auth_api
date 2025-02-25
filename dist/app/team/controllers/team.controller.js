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
const createTeam_service_1 = __importDefault(require("../services/createTeam.service"));
const deleteTeam_service_1 = __importDefault(require("../services/deleteTeam.service"));
const teamList_service_1 = __importDefault(require("../services/teamList.service"));
const updateTeam_service_1 = __importDefault(require("../services/updateTeam.service"));
const listTeamMembers_service_1 = __importDefault(require("../services/listTeamMembers.service"));
const removeTeamMember_service_1 = __importDefault(require("../services/removeTeamMember.service"));
const getTeamDetail_service_1 = __importDefault(require("../services/getTeamDetail.service"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class TeamController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : create team API
    🗓 @created : 20/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createTeam(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  create team services
                //
                yield (0, createTeam_service_1.default)(container);
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
   🚩 @uses : delete team API
   🗓 @created : 21/11/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    deleteTeam(req, res, next) {
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
                //  create team service
                //
                yield (0, deleteTeam_service_1.default)(container);
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
🚩 @uses : list team API
🗓 @created : 22/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
    listTeam(req, res, next) {
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
                //  get team list service
                //
                yield (0, teamList_service_1.default)(container);
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
    🚩 @uses : update team API
    🗓 @created : 23/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTeam(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update team services
                //
                yield (0, updateTeam_service_1.default)(container);
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
    🚩 @uses : List team members API
    🗓 @created : 29/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listTeamMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list all team members of particular team service
                //
                yield (0, listTeamMembers_service_1.default)(container);
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
    🚩 @uses : Remove team members API
    🗓 @created : 29/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    removeTeamMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list all team members of particular team service
                //
                yield (0, removeTeamMember_service_1.default)(container);
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
    🚩 @uses : Remove team members API
    🗓 @created : 29/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTeamDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list all team members of particular team service
                //
                yield (0, getTeamDetail_service_1.default)(container);
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
exports.default = new TeamController();
//# sourceMappingURL=team.controller.js.map