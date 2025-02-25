"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
// Import Controllers
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
// Import Interface
// Import Validators
const auth_validator_1 = require("../validators/auth.validator");
const validator_helper_1 = require("../../../helpers/validator.helper");
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const router = express_1.default.Router();
router.post('/signup', (0, validator_helper_1.validator)(auth_validator_1.singnUpSchema.signUpValidator), auth_controller_1.default.signup);
router.post('/login', (0, validator_helper_1.validator)(auth_validator_1.loginSchema.loginValidator), auth_controller_1.default.login);
router.get('/get_token', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, auth_controller_1.default.getTokens);
router.post('/forget_password', (0, validator_helper_1.validator)(auth_validator_1.loginSchema.forgetPasswordValidator), auth_controller_1.default.forgetPassword);
router.post('/reset_password', (0, validator_helper_1.validator)(auth_validator_1.loginSchema.resetValidator), auth_controller_1.default.reset);
router.post('/change_password', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(auth_validator_1.loginSchema.changePasswordValidator), auth_controller_1.default.changePassword);
router.post('/verify_email', (0, validator_helper_1.validator)(auth_validator_1.loginSchema.verifyEmail), auth_controller_1.default.emailVerify);
router.post('/resend_email', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(auth_validator_1.loginSchema.resendEmail), auth_controller_1.default.resendEmail);
module.exports = router;
//# sourceMappingURL=auth.route.js.map