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
const getUser_service_1 = __importDefault(require("../services/getUser.service"));
const updateUserProfile_service_1 = __importDefault(require("../services/updateUserProfile.service"));
const membersList_service_1 = __importDefault(require("../services/membersList.service"));
const invitedMemeberList_service_1 = __importDefault(require("../services/invitedMemeberList.service"));
const accetpDelineInvite_service_1 = __importDefault(require("../services/accetpDelineInvite.service"));
const addMember_service_1 = __importDefault(require("../services/addMember.service"));
const listUserOrganizations_service_1 = __importDefault(require("../services/listUserOrganizations.service"));
const listUsers_service_1 = __importDefault(require("../services/listUsers.service"));
const getUserDetailsByUuid_service_1 = __importDefault(require("../services/getUserDetailsByUuid.service"));
const updateUserStatus_service_1 = __importDefault(require("../services/updateUserStatus.service"));
const getAllUsers_service_1 = __importDefault(require("../services/getAllUsers.service"));
const saveUserLanguage_service_1 = __importDefault(require("../services/saveUserLanguage.service"));
// Import Middleware
// Import Controllers
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
const inviteVerification_service_1 = __importDefault(require("../services/inviteVerification.service"));
const createUserProfile_service_1 = __importDefault(require("../services/createUserProfile.service"));
const sentInvitationList_service_1 = __importDefault(require("../services/sentInvitationList.service"));
class UserController {
    /*
    * 😎 @author : Sushant Shekhar
    * 🚩 @uses : to get the user me data
    * 🗓 Created : 19/10/2023
    */
    getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: {
                            uuid: req.logged_in_user.uuid
                        },
                        query: req.query,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // get the user data
                //
                yield (0, getUser_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : edit user profile API
    🗓 @created : 15/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // edit profile service
                //
                yield (0, updateUserProfile_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get members list realted to same company
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    membersList(req, res, next) {
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
                // members list service
                //
                yield (0, membersList_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all invited members list realted to logged in user of same company
    🗓 @created : 23/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    invitedMembersList(req, res, next) {
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
                // invited members list service
                //
                yield (0, invitedMemeberList_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update status as accept or decline of invited members in user_invitation table
    🗓 @created : 24/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    acceptDeclineInvite(req, res, next) {
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
                // accept or declined status update service
                //
                yield (0, accetpDelineInvite_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : add members for particular team by email
    🗓 @created : 28/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    addMembers(req, res, next) {
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
                // add members for team service
                //
                yield (0, addMember_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : invitation is expired or not verification API
    🗓 @created : 4/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    inviteVerification(req, res, next) {
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
                //  invitation is expired or not verification service
                //
                yield (0, inviteVerification_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get list of user organizations
    🗓 @created : 09/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserOrganizationsList(req, res, next) {
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
                //  Get organizations list service
                //
                yield (0, listUserOrganizations_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user's list
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserList(req, res, next) {
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
                //  Get user list service
                //
                yield (0, listUsers_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user details by uuid
    🗓 @created : 26/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserDetailsByUuid(req, res, next) {
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
                //  Get user details by uuid service
                //
                yield (0, getUserDetailsByUuid_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user status
    🗓 @created : 26/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserStatus(req, res, next) {
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
                //  update user status service
                //
                yield (0, updateUserStatus_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all users
    🗓 @created : 01/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUsersDetails(req, res, next) {
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
                //  Get user list service
                //
                yield (0, getAllUsers_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save user language
    🗓 @created : 13/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveUserLanguage(req, res, next) {
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
                //  to save user language
                //
                yield (0, saveUserLanguage_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : create user profile
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createUserProfile(req, res, next) {
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
                //  to create user profile
                //
                yield (0, createUserProfile_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all sent invited members list send by company
    🗓 @created : 07/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    sentInvitedMembersList(req, res, next) {
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
                // sent invited members list service
                //
                yield (0, sentInvitationList_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error)).json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map