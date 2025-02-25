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
// Import Helpers
const auth_helper_1 = __importDefault(require("../helper/auth.helper"));
// Import Repos
const auth_repos_1 = __importDefault(require("../repos/auth.repos"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const userRole_repo_1 = __importDefault(require("../../user/repos/userRole.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
// Import permission
const defaultPermission_1 = __importDefault(require("../../../config/defaultPermission"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const randomstring_1 = __importDefault(require("randomstring"));
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses :    signup Services
🗓 @created : 17/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const signupServices = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        i18n_1.default.setLocale('nl');
        //
        //  Store hashed password in derived
        //
        yield storeHasedPassword(container);
        //
        //  Validate company already exist or not
        //
        yield validCompany(container);
        //
        //  If company is new then insert data in datbase
        //
        yield storeDataInDatabase(container);
        //
        //  Search user deatails  by email and store in derived
        //
        container.derived.user = yield company_repos_1.default.getUserByEmail(body.email);
        //
        //  Prepare the Payload for accessToken
        //
        container.output.result.access_token = yield auth_helper_1.default.generateAccessToken(container);
        //
        //  Prepare the Payload for refreshToken
        //
        container.output.result.refresh_token = yield auth_helper_1.default.generateRefreshToken(container);
        //
        //  Email verify email to the user
        //
        //await verifyEmail(container);
        //
        //  message
        //
        //container.output.message = i18n.__('email_verify_mail_sent');
        //
        //  Save derived user in result for final output
        //
        container.output.result.user = container.derived.user;
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses :    Service to check valid company
🗓 @created : 17/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validCompany = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        if (body.organization_name) {
            //
            //  Validate company by organization name in database
            //
            const verifyCompanyData = yield company_repos_1.default.getCompanyData(body.organization_name);
            container.derived.companyData = verifyCompanyData;
            if (verifyCompanyData) {
                //
                //  Get user data by email
                //
                container.derived.user = yield company_repos_1.default.getUserByEmail(body.email);
                if (container.derived.user) {
                    //
                    //  Check that same user with same company exit or not
                    //
                    const emailWithCompanyExist = yield company_repos_1.default.checkEmailWithCompany(container);
                    if (emailWithCompanyExist) {
                        const err = new Error(i18n_1.default.__("user.email_with_same_company_exist"));
                        err.statusCode = 400;
                        throw err;
                    }
                    else {
                        const err = new Error(i18n_1.default.__("user.company_already_exist"));
                        err.statusCode = 200;
                        throw err;
                    }
                }
                else {
                    const err = new Error(i18n_1.default.__("user.company_already_exist"));
                    err.statusCode = 200;
                    throw err;
                }
            }
        }
        else {
            //
            //  Get user data by email
            //
            container.derived.user = yield company_repos_1.default.getUserByEmail(body.email);
            if (container.derived.user) {
                const err = new Error(i18n_1.default.__("user.user_exists"));
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
🚩 @uses    : Service to store Hashed Password
🗓 @created : 17/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeHasedPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password } } = container;
        //
        //  Hash the password of the user while signup
        //
        container.derived.password = yield auth_helper_1.default.createHashedPassword(body.password);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses    : Service to store all data in database
🗓 @created : 17/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInDatabase = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password } } = container;
        //
        //  store data in user table 
        //
        yield storeDataInUserTable(container);
        //
        //  store data in company table 
        //
        yield storeDataInCompanyTable(container);
        //
        //  store data in user company table 
        //    
        yield storeDataInUserCompanyTable(container);
        //
        //  store data in user role table
        //
        yield storeDataInUserRoleTable(container);
        //
        //  store data into user permission table 
        //
        yield storeDataInUserPermissionTable(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses    : Service to store data in user Table
🗓 @created : 5/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInUserTable = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password } } = container;
        //
        //  Get user details by email
        //
        container.derived.userDetails = yield company_repos_1.default.getUserByEmail(body.email);
        if (container.derived.userDetails) {
            //
            // store user uuid
            //
            container.derived.userUuid = container.derived.userDetails.uuid;
        }
        else {
            const singupModel = {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
                password: password,
                language: constant_1.default.user_language.DUTCH,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            };
            //
            //  Insert User details in user table
            //
            container.derived.userDetails = yield auth_repos_1.default.insertUserDetails(singupModel);
            //
            //  Get user details by email
            //
            const data = yield company_repos_1.default.getUserByEmail(body.email);
            container.derived.userUuid = data.uuid;
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
🚩 @uses    : Service to store data in company Table
🗓 @created : 5/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInCompanyTable = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        if (body.organization_name) {
            //
            //  Insert company details in company table
            //
            const companyModel = {
                name: body.organization_name,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: userUuid
            };
            container.derived.companyDetails = yield auth_repos_1.default.insertCompanyDetails(companyModel);
            return container;
        }
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses    : Service to store data in user company Table
🗓 @created : 5/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInUserCompanyTable = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        if (body.organization_name) {
            //
            //  Get company details by organization name
            //
            const getcompanyData = yield company_repos_1.default.getCompanyData(body.organization_name);
            //
            //  Insert  details in user_company table
            //  
            const userCompanyModel = {
                company_uuid: getcompanyData.uuid,
                user_uuid: userUuid,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield auth_repos_1.default.insertUserCompanyDetails(userCompanyModel);
            //
            //  Get roles
            //
            const getRoleData = yield auth_repos_1.default.getOwnerRoleData();
            //
            //  check user role already added or not
            //
            const checkOwnerRole = yield userRole_repo_1.default.checkUserRole(getRoleData.uuid, userUuid);
            if (!checkOwnerRole) {
                //
                //  Insert  role details in user_role table
                // 
                const ownerRoleModel = {
                    role_uuid: getRoleData.uuid,
                    user_uuid: userUuid
                };
                yield auth_repos_1.default.insertUserRoleDetails(ownerRoleModel);
            }
            return container;
        }
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses    : Service to store data in user role Table
🗓 @created : 5/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInUserRoleTable = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        //
        //  Get company details by organization name
        //
        const getRoleData = yield auth_repos_1.default.getRoleData();
        //
        //  check user role already added or not
        //
        const checkUserRole = yield userRole_repo_1.default.checkUserRole(getRoleData.uuid, userUuid);
        if (!checkUserRole) {
            //
            //  Insert  role details in user_role table
            // 
            const userRoleModel = {
                role_uuid: getRoleData.uuid,
                user_uuid: userUuid
            };
            yield auth_repos_1.default.insertUserRoleDetails(userRoleModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : store data into user permission table
🗓 @created : 29/07/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeDataInUserPermissionTable = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        //
        //  check user permission already inserted or not
        //
        const checkUserPermission = yield user_repo_1.default.checkUserPermission(userUuid);
        if (checkUserPermission && checkUserPermission.length == 0) {
            //
            // Prepare the batch request
            //
            const userPermissionModelData = [];
            const userRole = constant_1.default.system_roles.USER;
            const userPermission = defaultPermission_1.default.role_permission[userRole];
            for (const per of userPermission) {
                userPermissionModelData.push({
                    user_uuid: userUuid,
                    action_code: per,
                    is_allow: true,
                    updated_by: userUuid,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                });
            }
            //
            //  insert user permission
            //  
            const saveUserPermission = yield user_repo_1.default.insertUserPermission(userPermissionModelData);
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
  🚩 @uses    : Service to store data in user role Table
  🗓 @created : 5/12/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
const verifyEmail = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        //
        //generate random 16 digit code 
        //
        container.derived.randomCode = randomstring_1.default.generate(16);
        //
        //set expiry time of 10 min
        //
        container.derived.expiryTime = moment_timezone_1.default.utc().add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
        //
        //save random 16 digit code to the user database and 10 minute expiry time
        //
        yield auth_repos_1.default.saveRandomCode(container);
        //
        //send email to user regarding email verification
        //
        yield sendVerifyEmailToUser(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : send email to user regarding forget Password
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendVerifyEmailToUser = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, derived: { user, randomCode } } = container;
        if (user.language == constant_1.default.user_language.ENGLISH) {
            //
            // creating data for email 
            // 
            container.derived.message = {
                randomCode: randomCode,
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('email_verify.verify_email_english'),
                welcome_text: i18n_1.default.__('email_verify.welcome_text'),
                glad_text: i18n_1.default.__('email_verify.glad_text'),
                head_text: i18n_1.default.__('email_verify.head_text'),
                para_text: i18n_1.default.__('email_verify.para_text'),
                button_text: i18n_1.default.__('email_verify.button_text'),
                para_second_text: i18n_1.default.__('email_verify.para_second_text_english'),
                query_text: i18n_1.default.__('email_verify.query_text'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/verify-email?token=${randomCode}`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.VERIFY_EMAIL, container.derived.message);
            yield (0, sendEmail_1.default)(container.derived.message);
        }
        else {
            //
            // creating data for email 
            // 
            container.derived.message = {
                randomCode: randomCode,
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('email_verify.verify_email_dutch'),
                welcome_text: i18n_1.default.__('email_verify.welcome_text_dutch'),
                glad_text: i18n_1.default.__('email_verify.glad_text_dutch'),
                head_text: i18n_1.default.__('email_verify.head_text_dutch'),
                para_text: i18n_1.default.__('email_verify.para_text_dutch'),
                button_text: i18n_1.default.__('email_verify.button_text_dutch'),
                para_second_text: i18n_1.default.__('email_verify.para_second_text_dutch'),
                query_text: i18n_1.default.__('email_verify.query_text_dutch'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/verify-email?token=${randomCode}`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.VERIFY_EMAIL, container.derived.message);
            yield (0, sendEmail_1.default)(container.derived.message);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = signupServices;
//# sourceMappingURL=signup.services.js.map