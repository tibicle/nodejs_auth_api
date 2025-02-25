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
// Import validations
// Import Transformers
// Import Libraries
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const user_repo_1 = __importDefault(require("../repos/user.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const team_repo_1 = __importDefault(require("../../team/repos/team.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : invitation is expired or not service
🗓 @created : 4/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const inviteVerificationService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, } = container;
        //
        //  get expiry time by invite code
        //
        const invitationDetial = yield user_repo_1.default.getExpiryTime(body.invite_code);
        //
        //  get current time
        //
        const currentTime = moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss");
        //
        //  get team detail
        //
        const team = yield team_repo_1.default.getTeamByUuid(body.team_uuid);
        //
        //  get user detail by email
        //
        const user = yield user_repo_1.default.getUserByEmail(invitationDetial.email);
        if (user && team) {
            if (((0, moment_timezone_1.default)(currentTime) > (0, moment_timezone_1.default)(invitationDetial.expires_at))) {
                const err = new Error(i18n_1.default.__('user.expired_time'));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  get company name by uuid
            //
            const company = yield company_repos_1.default.getCompanyDetailsByUuid(team.company_uuid);
            const data = {
                email: invitationDetial.email,
                company_name: company.name
            };
            container.output.result = data;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = inviteVerificationService;
//# sourceMappingURL=inviteVerification.service.js.map