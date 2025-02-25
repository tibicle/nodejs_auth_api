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
const auth_helper_1 = __importDefault(require("../../auth/helper/auth.helper"));
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const userRole_repo_1 = __importDefault(require("../../user/repos/userRole.repo"));
const staff_repo_1 = __importDefault(require("../repos/staff.repo"));
const defaultPermission_1 = __importDefault(require("../../../config/defaultPermission"));
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : add staff service
🗓 @created : 15/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addStaffService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  store hased password
        //
        yield storeHasedPassword(container);
        //
        //  save staff details
        //
        yield saveStaffDetails(container);
        //
        //  send mail to onboard staff their credentials
        //
        yield sendEmailToStaff(container);
        container.output.message = i18n_1.default.__('staff.add_staff');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : store hashed password
🗓 @created : 22/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeHasedPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  Hash the password of the staff while adding staff
        //
        container.derived.password = yield auth_helper_1.default.createHashedPassword(body.password);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save staff details
🗓 @created : 15/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveStaffDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { password } } = container;
        //
        // validate user is already present or not
        //
        let staffDetails = yield user_repo_1.default.getUserByEmail(body.email);
        if (!staffDetails) {
            //
            //  prepare data model to save staff details
            //
            const staffDataModel = {
                email: body.email,
                password: password,
                first_name: body.first_name,
                last_name: body.last_name,
                mobile_no: body.mobile_no,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: logged_in_user.uuid
            };
            //
            //  save staff details
            //
            staffDetails = yield staff_repo_1.default.saveStaffDetails(staffDataModel);
        }
        else {
            //
            //  get role
            //
            const roleData = yield userRole_repo_1.default.getRole();
            if (roleData) {
                for (let role of roleData) {
                    if (role.code == 'team_manager' || role.code == 'team_owner' || role.code == 'team_member') {
                        continue;
                    }
                    else {
                        //
                        //  check that is there any role present in the user role table
                        //
                        const userRoleData = yield userRole_repo_1.default.getRoleByRoleUuid(role.uuid, staffDetails.uuid);
                        if (userRoleData) {
                            yield userRole_repo_1.default.deleteUserRole(role.uuid, staffDetails.uuid);
                        }
                        const userRole = role.code;
                        const userPermission = defaultPermission_1.default.role_permission[userRole];
                        if (userPermission) {
                            for (const per of userPermission) {
                                yield userRole_repo_1.default.deleteUserPermission(per, staffDetails.uuid);
                            }
                        }
                    }
                }
                //
                //  prepare update staff model
                //
                const staffDetailModel = {
                    password: password,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    mobile_no: body.mobile_no,
                    created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                    created_by: logged_in_user.uuid
                };
                //
                //  update the user details which already registered to staff  
                //
                yield staff_repo_1.default.updateStaffDetails(staffDetails.uuid, staffDetailModel);
            }
        }
        //
        //  validate role uuid
        //
        yield userRole_repo_1.default.checkRole(body.role_uuid);
        //
        //  prepare data model to save the role
        //
        const roleDataModel = {
            user_uuid: staffDetails.uuid,
            role_uuid: body.role_uuid
        };
        //
        //  save staff role
        //
        yield userRole_repo_1.default.saveUserRoleData(roleDataModel);
        //
        // Prepare the batch request
        //
        const userPermissionModelData = [];
        //
        // Temp permission data to check only
        //
        const tempPermissionData = [];
        //
        //  get role by uuid
        //
        const role = yield userRole_repo_1.default.checkRole(body.role_uuid);
        const userRole = role.code;
        container.derived.user_role_code = role.name;
        const userPermission = defaultPermission_1.default.role_permission[userRole];
        for (const per of userPermission) {
            userPermissionModelData.push({
                user_uuid: staffDetails.uuid,
                action_code: per,
                is_allow: true,
                updated_by: logged_in_user.uuid,
                updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
            });
            tempPermissionData.push(per);
        }
        const roleUser = yield userRole_repo_1.default.getRoleByName('user');
        const userPermissionRole = defaultPermission_1.default.role_permission[roleUser.code];
        for (const per of userPermissionRole) {
            if (tempPermissionData.includes(per)) {
                continue;
            }
            else {
                userPermissionModelData.push({
                    user_uuid: staffDetails.uuid,
                    action_code: per,
                    is_allow: true,
                    updated_by: logged_in_user.uuid,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                });
            }
        }
        //
        //  insert user permission
        //  
        const saveUserPermission = yield user_repo_1.default.insertUserPermission(userPermissionModelData);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : send email to staff
🗓 @created : 26/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendEmailToStaff = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, derived: { user, password, user_role_code } } = container;
        if (logged_in_user.language == constant_1.default.user_language.ENGLISH) {
            //
            // creating data for email 
            // 
            container.derived.message = {
                to: [{ email: body.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('onbard_staff.verify_email_english'),
                welcome_text: i18n_1.default.__('onbard_staff.welcome_text'),
                glad_text: i18n_1.default.__('onbard_staff.glad_text'),
                head_text: i18n_1.default.__('onbard_staff.head_text'),
                para_text: user_role_code,
                email: body.email,
                password: body.password,
                first_name: body.first_name,
                last_name: body.last_name,
                button_text: i18n_1.default.__('onbard_staff.button_text'),
                para_second_text: i18n_1.default.__('onbard_staff.para_second_text_english'),
                query_text: i18n_1.default.__('onbard_staff.query_text'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.ADMIN_VIDEO_FREDO_FE_URL}/login`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.STAFF_EMAIL, container.derived.message);
            yield (0, sendEmail_1.default)(container.derived.message);
        }
        else {
            //
            // creating data for email 
            // 
            container.derived.message = {
                to: [{ email: body.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('onbard_staff.verify_email_dutch'),
                welcome_text: i18n_1.default.__('onbard_staff.welcome_text_dutch'),
                glad_text: i18n_1.default.__('onbard_staff.glad_tex_dutch'),
                head_text: i18n_1.default.__('onbard_staff.head_text_dutch'),
                para_text: user_role_code,
                email: body.email,
                password: body.password,
                first_name: body.first_name,
                last_name: body.last_name,
                button_text: i18n_1.default.__('onbard_staff.button_text_dutch'),
                para_second_text: i18n_1.default.__('onbard_staff.para_second_text_dutch'),
                query_text: i18n_1.default.__('onbard_staff.query_text_dutch'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.ADMIN_VIDEO_FREDO_FE_URL}/login`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.STAFF_EMAIL, container.derived.message);
            yield (0, sendEmail_1.default)(container.derived.message);
        }
        container.output.message = i18n_1.default.__('staff.staff_onboard_email');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = addStaffService;
//# sourceMappingURL=addStaff.service.js.map