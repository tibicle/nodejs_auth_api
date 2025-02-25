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
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const auth_repos_1 = __importDefault(require("../repos/auth.repos"));
const randomstring_1 = __importDefault(require("randomstring"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : forget user password service
🗓 @created : 23/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const forgetUserPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        i18n_1.default.setLocale('nl');
        //
        //  check user exists or not by email
        //
        yield checkExistingUser(container);
        //
        //  generate random code and expiry time
        //
        yield generateRandomCode(container);
        //
        //save random 16 digit code to the user database and 10 minute expiry time
        //
        yield auth_repos_1.default.saveRandomCode(container);
        //
        //send email to user regarding forget password
        //
        yield sendEmailToUser(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : generate new 16 digit random code and save to database
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkExistingUser = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //  check user exists or not by email
        //
        container.derived.user = yield company_repos_1.default.getUserByEmail(body.email);
        if (!container.derived.user) {
            const err = new Error(i18n_1.default.__("user.no_user_exist"));
            err.statusCode = 400;
            throw err;
        }
        if (container.derived.user.status == 'DEACTIVE') {
            const err = new Error(i18n_1.default.__("user.deactived"));
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
🚩 @uses : generate new 16 digit random code and save to database
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const generateRandomCode = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //generate random 16 digit code 
        //
        container.derived.randomCode = randomstring_1.default.generate(16);
        //
        //set expiry time of 10 min
        //
        container.derived.expiryTime = moment_timezone_1.default.utc().add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
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
const sendEmailToUser = (container) => __awaiter(void 0, void 0, void 0, function* () {
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
                subject: i18n_1.default.__('password_reset_english'),
                head_text: i18n_1.default.__('forget_password.head_text'),
                para_text: i18n_1.default.__('forget_password.para_text'),
                button_text: i18n_1.default.__('forget_password.button_text'),
                para_second_text: i18n_1.default.__('forget_password.para_second_text'),
                query_text: i18n_1.default.__('forget_password.query_text'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/reset-password?token=${randomCode}`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.FORGOT_PASSWORD, container.derived.message);
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
                subject: i18n_1.default.__('password_reset_dutch'),
                head_text: i18n_1.default.__('forget_password.head_text_dutch'),
                para_text: i18n_1.default.__('forget_password.para_text_dutch'),
                button_text: i18n_1.default.__('forget_password.button_text_dutch'),
                para_second_text: i18n_1.default.__('forget_password.para_second_text_dutch'),
                query_text: i18n_1.default.__('forget_password.query_text_dutch'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/reset-password?token=${randomCode}`
            };
            // 
            // getting html from template 
            // 
            container.derived.message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.FORGOT_PASSWORD, container.derived.message);
            yield (0, sendEmail_1.default)(container.derived.message);
        }
        container.output.message = i18n_1.default.__('auth.forget_password_mail_sent');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = forgetUserPassword;
//# sourceMappingURL=forgetPassword.service.js.map