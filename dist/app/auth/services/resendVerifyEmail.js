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
// Import config
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import repos
const auth_repos_1 = __importDefault(require("../repos/auth.repos"));
// Import third Party
const randomstring_1 = __importDefault(require("randomstring"));
const moment_1 = __importDefault(require("moment"));
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses    : Service to resend the email to verify
  🗓 @created : 5/12/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
const resendEmail = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { password, userUuid } } = container;
        //
        //  check user reset_hash and expiry time is valid or not
        //
        yield validateExpiryTime(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate expiry time
🗓 @created : 09/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateExpiryTime = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //get user Expiry time from database and match with current time by using code from body
        //
        const userExpiryTime = yield auth_repos_1.default.getResetHashByEmail(body.email);
        if (!userExpiryTime) {
            const err = new Error(i18n_1.default.__("auth.email_not_exists"));
            err.statusCode = 400;
            throw err;
        }
        if (userExpiryTime && userExpiryTime.is_email_verified == true) {
            let responseKey = {
                is_email_verified: true
            };
            container.output.result = responseKey;
            container.output.message = i18n_1.default.__('user.email_already_verified');
            return container;
        }
        container.derived.user = userExpiryTime;
        //
        //  generate random 16 digit code 
        //
        container.derived.randomCode = randomstring_1.default.generate(16);
        //
        //  set expiry time of 10 min
        //
        container.derived.expiryTime = moment_1.default.utc().add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
        //
        //  resend code model
        //
        const resendCodeModel = {
            reset_hash: container.derived.randomCode,
            expiry_time: container.derived.expiryTime
        };
        //
        //  save random 16 digit code to the user database and 10 minute expiry time
        //
        yield auth_repos_1.default.saveResendRandomCode(resendCodeModel, container.derived.user.email);
        //
        //  send email to user regarding email verification
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
        container.output.message = i18n_1.default.__('email_verify_mail_sent');
        let responseKey = {
            is_email_verified: false
        };
        container.output.result = responseKey;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = resendEmail;
//# sourceMappingURL=resendVerifyEmail.js.map