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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import repo
const team_repo_1 = __importDefault(require("../../team/repos/team.repo"));
const user_repo_1 = __importDefault(require("../repos/user.repo"));
// Import Interface
// Import Helpers
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
// Import validations
// Import Transformers
// Import Libraries
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const randomstring_1 = __importDefault(require("randomstring"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : add members to the team by email service
* 🗓 Created : 28/11/2023
*/
const addMemberService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  validate logged in user is owner or not
        //
        if (logged_in_user.roles.includes('owner') == false) {
            const err = new Error(i18n_1.default.__("team.owner_send_mail"));
            err.statusCode = 400;
            throw err;
        }
        if (body.company_uuid) {
            //
            //  validate company uuid is valid
            //
            yield company_repos_1.default.checkCompanyExists(body.company_uuid);
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
        if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN)) && !(logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR))) {
            //
            //  validate user has any active subscription
            //
            yield validateActiveUserSubscription(container);
        }
        //
        //  send mail and store invited member in user invitation table
        //
        yield addMember(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : send email to invite member
🗓 @created : 28/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addMember = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  get team details
        //
        const teamDetails = yield team_repo_1.default.getTeamByUuid(body.team_uuid);
        //
        //  get total members in particular team
        //
        const totalMembers = yield team_repo_1.default.getTeamMemberByTeamUuid(body.team_uuid);
        var subscription = yield subscription_repo_1.default.getSubscriptionByCompanyUuid(teamDetails.company_uuid);
        if (!subscription) {
            const err = new Error(i18n_1.default.__('subscription.no_subscription'));
            err.statusCode = 400;
            throw err;
        }
        if (subscription) {
            if ((totalMembers.length + 1) > parseInt(subscription.user_access)) {
                const err = new Error(i18n_1.default.__('subscription.team_message_already_filled'));
                err.statusCode = 400;
                throw err;
            }
        }
        //
        //  check duplicate email present or not
        //
        const duplicateEmail = yield checkDuplicateEmail(body.email);
        if (duplicateEmail) {
            const err = new Error(i18n_1.default.__('user.duplicate_email'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  get total members in particular team
        //
        const teamMembers = yield team_repo_1.default.getTeamMemberByTeamUuid(body.team_uuid);
        //
        //  get subscription limit of the user
        //
        if (body.company_uuid) {
            var companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            if (teamMembers.length > parseInt(companySubscription.user_access)) {
                const err = new Error(i18n_1.default.__('subscription.limit_exceed_member'));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            var userSubscription = yield subscription_repo_1.default.getUserSubscription(logged_in_user.uuid);
            if (teamMembers.length > parseInt(userSubscription.user_access)) {
                const err = new Error(i18n_1.default.__('subscription.limit_exceed_member'));
                err.statusCode = 400;
                throw err;
            }
        }
        const currentDate = moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss');
        if (userSubscription || companySubscription) {
            if (body.company_uuid) {
                let companyLimit = parseInt(companySubscription.user_access);
                if (body.email.length > companyLimit) {
                    const err = new Error(i18n_1.default.__('subscription.limit_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                let userLimit = parseInt(userSubscription.user_access);
                if (body.email.length > userLimit) {
                    const err = new Error(i18n_1.default.__('subscription.limit_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            //
            //  store members in user invitation table and send mail
            //
            if (body.email) {
                for (let i = 0; i < body.email.length; i++) {
                    //
                    //  get user deatils by email
                    //
                    container.derived.user = yield user_repo_1.default.getUserByEmail(body.email[i]);
                    //
                    //  generate random 8 digit code 
                    //
                    container.derived.code = randomstring_1.default.generate(8);
                    //
                    //  set expiry time of 24 hr
                    //
                    container.derived.expires_at = moment_timezone_1.default.utc().add(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                    if (!container.derived.user) {
                        //
                        //  if user not found by the email then for that user uuid would be null
                        //
                        container.derived.user = {
                            email: body.email[i]
                        };
                    }
                    //
                    //  get team details by team uuid
                    //
                    container.derived.teamName = yield team_repo_1.default.getTeamByUuid(body.team_uuid);
                    //
                    //  check same user with email aready a member or not
                    //
                    const user = yield user_repo_1.default.getUserByEmail(body.email[i]);
                    let teamMember;
                    if (user) {
                        //
                        //  get team member with team uuid and user uuid exist or not
                        //
                        teamMember = yield team_repo_1.default.getTeamMemberByTeamAndUser(body.team_uuid, user.uuid);
                    }
                    if (teamMember) {
                        //
                        //  already a member of same team
                        //
                        const err = new Error(i18n_1.default.__('user.already_member', {
                            email: body.email[i]
                        }));
                        err.statusCode = 400;
                        throw err;
                    }
                    else {
                        //
                        //  send email to the user
                        //
                        yield sendEmailToMember(container);
                        // 
                        //  check that same email and same team present or not
                        //
                        const invitationData = yield user_repo_1.default.checkEmailAndTeamUuid(body.email[i], body.team_uuid, constant_1.default.user_invitation.PENDING);
                        if (!invitationData) {
                            //
                            //  store invited memeber to user invitation table
                            //
                            yield saveInviteMembers(container);
                        }
                    }
                }
            }
        }
        else {
            const err = new Error(i18n_1.default.__('subscription.no_subscription'));
            err.statusCode = 400;
            throw err;
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
🚩 @uses : save invite members in user invitation table
🗓 @created : 28/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveInviteMembers = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { user } } = container;
        //
        //  invite member model
        //
        const inviteMembersModel = {
            email: user.email,
            team_uuid: body.team_uuid,
            status: constant_1.default.user_invitation.PENDING,
            code: container.derived.code,
            expires_at: container.derived.expires_at,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  save invite member model in user invitation table
        //
        yield user_repo_1.default.saveInviteMembers(inviteMembersModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : send email to invite member
🗓 @created : 28/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendEmailToMember = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, derived: { user, teamName, code } } = container;
        if (logged_in_user.lang == constant_1.default.user_language.ENGLISH) {
            //
            // creating data for email 
            // 
            const message = {
                teamName: teamName.name,
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__(`team.team_invite`, {
                    team: teamName.name
                }),
                head_text: i18n_1.default.__('invite_member.head_text'),
                para_text: i18n_1.default.__('invite_member.para_text'),
                button_text: i18n_1.default.__('invite_member.button_text'),
                para_second_text: i18n_1.default.__('invite_member.para_second_text'),
                query_text: i18n_1.default.__('invite_member.query_text'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/account/invite-list?activeIndex=0&teamuuid=${body.team_uuid}&invitecode=${code}`,
                htmlContent: ""
            };
            message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.INVITE_MEMBER, message);
            yield (0, sendEmail_1.default)(message);
        }
        else {
            //
            // creating data for email 
            // 
            const message = {
                teamName: teamName.name,
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__(`team.team_invite_dutch`, {
                    team: teamName.name
                }),
                head_text: i18n_1.default.__('invite_member.head_text_dutch'),
                para_text: i18n_1.default.__('invite_member.para_text_dutch'),
                button_text: i18n_1.default.__('invite_member.button_text_dutch'),
                para_second_text: i18n_1.default.__('invite_member.para_second_text_dutch'),
                query_text: i18n_1.default.__('invite_member.query_text_dutch'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/account/invite-list?activeIndex=0&teamuuid=${body.team_uuid}&invitecode=${code}`,
                htmlContent: ""
            };
            message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.INVITE_MEMBER, message);
            yield (0, sendEmail_1.default)(message);
        }
        container.output.message = i18n_1.default.__('user.send_invite_email_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check duplicate email
🗓 @created : 28/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkDuplicateEmail = (emails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailSet = new Set();
        for (let email of emails) {
            const lowerEmail = email.toLowerCase();
            if (emailSet.has(email)) {
                return true;
            }
            emailSet.add(email);
        }
        return false;
    }
    catch (error) {
        throw error;
    }
});
exports.default = addMemberService;
//# sourceMappingURL=addMember.service.js.map