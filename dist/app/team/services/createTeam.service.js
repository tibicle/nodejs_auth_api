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
const constant_1 = __importDefault(require("../../../config/constant"));
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
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create team service
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createTeamService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        //
        //  validate logged in user is owner or not
        //
        if (logged_in_user.roles.includes('owner') == false) {
            const err = new Error(i18n_1.default.__("team.not_owner"));
            err.statusCode = 400;
            throw err;
        }
        if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN)) && !(logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR))) {
            //
            //  validate user has any active subscription
            //
            yield validateActiveUserSubscription(container);
        }
        //
        //  check company exists or not
        //
        if (body.company_uuid != null) {
            const companyData = yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            //
            //  validate logged in user is owner or not
            //
            if (companyData.created_by != logged_in_user.uuid) {
                const err = new Error(i18n_1.default.__("team.not_owner"));
                err.statusCode = 400;
                throw err;
            }
            //
            //  get all team in particular company
            //
            const teamDetails = yield team_repo_1.default.getAllTeamByCompanyUuid(body.company_uuid);
            //
            //  get all team members in total team
            //
            const teamMembers = yield team_repo_1.default.getTeamMemberInCompanyTeam(teamDetails);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            const teamCount = Number(teamMembers.count);
            const userAccessLimit = Number(companySubscription.user_access);
            if (teamCount >= userAccessLimit) {
                const err = new Error(i18n_1.default.__("team.cannot_create_team"));
                err.statusCode = 400;
                throw err;
            }
        }
        //
        //  validate name of the team already exist or not 
        //
        yield checkTeamName(container);
        //
        //  check tag is present or not
        //
        yield checkTag(container);
        //
        //  check team image exists or not
        //
        if (body.file_uuid && body.file_uuid != null) {
            yield file_repo_1.default.checkFile(body.file_uuid);
        }
        //
        //  store Team data
        //
        yield saveTeamData(container);
        //
        //  update file data
        //
        yield updateFileDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check user has active subscription or not
🗓 @created : 03/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateActiveUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails } } = container;
        const currentDate = moment_timezone_1.default.utc().format('YYYY-MM-DD');
        //
        //  check company exists or not if company_uuid is there
        //
        if (body.company_uuid && body.company_uuid != null) {
            yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            //
            //  check company have any pending subscription or not
            //
            const companyPendingSubscription = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(body.company_uuid);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            //
            //  check company approved status
            //
            const companyApprovedStatus = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(body.company_uuid);
            if (companySubscription && companySubscription.status === constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (companyPendingSubscription) {
                if (companyPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || companyPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (companySubscription && companySubscription.status == 'ACTIVE' && (0, moment_timezone_1.default)(companySubscription.end_date).format('YYYY-MM-DD') < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(companySubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (companyApprovedStatus && companyApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!companySubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  check user have any pending subscription or not
            //
            const userPendingSubscription = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user approved status
            //
            const userApprovedStatus = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(logged_in_user.uuid);
            if (userSubscription && userSubscription.status == constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (userPendingSubscription) {
                if (userPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || userPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (userSubscription && userSubscription.status == 'ACTIVE' && moment_timezone_1.default.utc(userSubscription.end_date).format("YYYY-MM-DD") < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(userSubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (userApprovedStatus && userApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!userSubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check name is already present or not
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkTeamName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        if (body.company_uuid) {
            //
            //  check team name exists or not in particular company
            //
            const companyProductionValidation = yield team_repo_1.default.validateTeamNameForCompany(body.name, body.company_uuid);
            if (companyProductionValidation) {
                //
                //  if same team name found then throw error
                //
                const err = new Error(i18n_1.default.__("team.name_already_exist"));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  check team name exists or not for self
            //
            const selfProductionValidation = yield team_repo_1.default.validateTeamNameForSelf(body.name, logged_in_user.uuid);
            if (selfProductionValidation) {
                //
                //  if same team name found then throw error
                //
                const err = new Error(i18n_1.default.__("team.name_already_exist"));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check tag is already present or not
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        if (body.tag || body.tag != null) {
            for (let i = 0; i < body.tag.length; i++) {
                //
                //  check tag is present or not
                //
                container.derived.tag = yield team_repo_1.default.validateTag(body.tag[i]);
                if (container.derived.tag) {
                    container.derived.tag_uuid.push(container.derived.tag.uuid);
                }
                if (!container.derived.tag || container.derived.tag == undefined) {
                    //
                    //  if tag not found insert new tag
                    //
                    container.derived.tagname = body.tag[i];
                    yield storeTag(container);
                }
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : story new tag in tag database
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create tag model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            type: constant_1.default.tag_type.TEAM,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new tag in tag database
        //
        yield team_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in tag_uuid array
        //
        const getTagUuid = yield team_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.tag_uuid.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : store data in production database
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveTeamData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        // create team model
        //
        const teamModel = {
            name: body.name,
            desc: body.about,
            tag_uuid: container.derived.tag_uuid,
            file_uuid: body.file_uuid,
            company_uuid: body.company_uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  store team model in team table
        //
        container.derived.teamUuid = yield team_repo_1.default.saveTeamDetail(teamModel);
        container.output.result = container.derived.teamUuid;
        //
        //  team member model
        //
        const teamMemberModel = {
            user_uuid: logged_in_user.uuid,
            team_uuid: container.derived.teamUuid.uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  store accepted member in team members table
        //
        yield user_repo_1.default.saveTeamMembers(teamMemberModel);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('team.team_created');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update file details
🗓 @created : 11/06/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid, teamUuid } } = container;
        if (body.file_uuid) {
            //
            //  prepare data model to uplaod file data
            //
            const updateFileDataModel = {
                ref_type: 'TEAM',
                ref_uuid: teamUuid.uuid,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield file_repo_1.default.updateFiledata(body.file_uuid, updateFileDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createTeamService;
//# sourceMappingURL=createTeam.service.js.map