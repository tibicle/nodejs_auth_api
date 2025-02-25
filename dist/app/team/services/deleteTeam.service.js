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
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const team_repo_1 = __importDefault(require("../repos/team.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete team service
🗓 @created : 21/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteTeamService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  validate team exist or not
        //
        container.derived.teamDetail = yield team_repo_1.default.getTeamByUuid(params.uuid);
        //
        //  delete all invited members from particular team in user_inivitation table
        //
        yield team_repo_1.default.deleteInvitedMembers(params.uuid);
        //
        //  delete all team members in that company
        //
        yield deleteTeamMemberFromCompany(container);
        //
        //  delete all team members from team members table
        //
        yield team_repo_1.default.deleteTeamMembers(params.uuid);
        //
        //  delete team
        //
        yield deleteTeam(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete team
🗓 @created : 21/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteTeam = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  delete team
        //
        yield team_repo_1.default.deleteTeamByUuid(params.uuid);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('team.team_deleted');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete team member from that related company.
🗓 @created : 06/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteTeamMemberFromCompany = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { teamDetail } } = container;
        // 
        // get total team of particular company
        //
        const totalTeam = yield team_repo_1.default.getAllTeamByCompanyUuid(teamDetail.company_uuid);
        if (totalTeam) {
            //
            //  get all team members 
            //
            const teamMembers = yield team_repo_1.default.getAllTeamMembersByTeamUuid(teamDetail.uuid);
            //
            //  run a loop and check that user is present in any totalteam if yes then do not delete that user else delete
            //
            for (let member of teamMembers) {
                //
                //  validate member is present in any team
                //
                const validMember = yield team_repo_1.default.validateTeamMemberInTeam(member.user_uuid, totalTeam, teamDetail.uuid);
                if (validMember.length == 0) {
                    //
                    //  delete member from user company table
                    //
                    yield company_repos_1.default.deleteUserFromCompany(member.user_uuid, teamDetail.company_uuid, teamDetail.created_by);
                }
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteTeamService;
//# sourceMappingURL=deleteTeam.service.js.map