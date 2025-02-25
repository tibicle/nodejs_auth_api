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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
// Import Libraries
// Import services
//  Import Repo
const team_repo_1 = __importDefault(require("../repos/team.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : remove team member
🗓 @created : 29/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const removeTeamMemberService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        //  validate team member exist or not
        //
        const teamMember = yield team_repo_1.default.validateTeamMember(params.uuid);
        //
        //  get team details
        //
        const teamDetail = yield team_repo_1.default.getTeamByUuid(teamMember.team_uuid);
        if (teamDetail.created_by == logged_in_user.uuid) {
            if (teamMember.user_uuid == logged_in_user.uuid) {
                const err = new Error(i18n_1.default.__('team.owner_self_delete'));
                err.statusCode = 400;
                throw err;
            }
            else {
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
                    //  Check that user is present in any totalteam if yes then do not delete that user else delete
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
                //
                //  remove team member from team members table
                //
                yield team_repo_1.default.deleteTeamMember(params.uuid);
                //
                //  add success message
                //
                container.output.message = i18n_1.default.__('team.team_member_deleted');
            }
        }
        else {
            const err = new Error(i18n_1.default.__('team.only_owner_delete'));
            err.statusCode = 400;
            throw err;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = removeTeamMemberService;
//# sourceMappingURL=removeTeamMember.service.js.map