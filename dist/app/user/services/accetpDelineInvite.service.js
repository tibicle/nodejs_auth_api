'use strict';
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
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import validations
// Import Repos
const user_repo_1 = __importDefault(require("../repos/user.repo"));
// Import Libraries
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const http_status_codes_1 = require("http-status-codes");
const team_repo_1 = __importDefault(require("../../team/repos/team.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const auth_repos_1 = __importDefault(require("../../auth/repos/auth.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : invited members list API service
* 🗓 Created : 24/11/2023
*/
const acceptDeclineInviteService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  validate invite uuid exist or not
        //
        yield checkInvitedMembers(container);
        //
        //  update status of user invitation table as accepted or declined
        //
        yield updateInviteStatus(container);
        //
        //  insert accepted member in team members table
        //
        yield storeAcceptedMember(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : insert accepted member in team members table
* 🗓 Created : 24/11/2023
*/
const checkInvitedMembers = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params, body } } = container;
        //
        //  validate Invited member exist or not
        //
        const invitedMember = yield user_repo_1.default.validateInvitedMember(params.invitation_uuid);
        if (!invitedMember) {
            const err = new Error(i18n_1.default.__('user.no_invited_member_exist'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : update status of invited members as accepted or declined in user invitation table
* 🗓 Created : 24/11/2023
*/
const updateInviteStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params, body } } = container;
        //
        //  get invite member details 
        //
        const invitedUser = yield user_repo_1.default.validateInvitedMember(params.invitation_uuid);
        //
        //  get team details
        //
        const teamDetails = yield team_repo_1.default.getTeamByUuid(invitedUser.team_uuid);
        //
        //  get all team in particular company
        //
        const allTeamDetails = yield team_repo_1.default.getAllTeamByCompanyUuid(teamDetails.company_uuid);
        //
        //  get all team members in total team
        //
        const teamMembers = yield team_repo_1.default.getTeamMemberInCompanyTeam(allTeamDetails);
        var subscription = yield subscription_repo_1.default.getSubscriptionByCompanyUuid(teamDetails.company_uuid);
        if (!subscription) {
            const err = new Error(i18n_1.default.__('subscription.no_subscription'));
            err.statusCode = 400;
            throw err;
        }
        const teamCount = Number(teamMembers.count);
        const userAccessLimit = Number(subscription.user_access);
        if (subscription) {
            if (teamCount >= userAccessLimit && body.status !== 'DECLINED') {
                const err = new Error(i18n_1.default.__('subscription.team_already_filled'));
                err.statusCode = 400;
                throw err;
            }
        }
        //
        //  update status model
        //
        const updateStatusModel = {
            status: body.status,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_by: logged_in_user.uuid
        };
        if (invitedUser.email == logged_in_user.email) {
            //
            //  update status of invited member
            //
            yield user_repo_1.default.updateInvitedMemeberStatus(params.invitation_uuid, updateStatusModel);
            //
            //  validate user company already exist or not
            //
            const data = yield company_repos_1.default.checkUserCompany(logged_in_user.uuid, teamDetails.company_uuid);
            if (!data) {
                //
                // put accepted user in user_company
                // 
                const userCompanyModel = {
                    company_uuid: teamDetails.company_uuid,
                    user_uuid: logged_in_user.uuid,
                    created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
                };
                yield auth_repos_1.default.insertUserCompanyDetails(userCompanyModel);
            }
        }
        else {
            const err = new Error(i18n_1.default.__('user.cannot_edit'));
            err.statusCode = 400;
            throw err;
        }
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : insert accepted member in team members table
* 🗓 Created : 24/11/2023
*/
const storeAcceptedMember = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params, body } } = container;
        //
        //  validate status must be accepted of invited member
        //
        const invitedMemberData = yield user_repo_1.default.validateInvitedMember(params.invitation_uuid);
        if (invitedMemberData.status == "ACCEPTED") {
            //
            //  team member model
            //
            const teamMemberModel = {
                user_uuid: logged_in_user.uuid,
                team_uuid: invitedMemberData.team_uuid,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: logged_in_user.uuid
            };
            //
            //  store accepted member in team members table
            //
            yield user_repo_1.default.saveTeamMembers(teamMemberModel);
        }
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('user.status_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = acceptDeclineInviteService;
//# sourceMappingURL=accetpDelineInvite.service.js.map