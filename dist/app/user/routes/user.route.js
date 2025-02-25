"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import Controllers
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
// Import Interface
// Import Validators
const user_validator_1 = __importDefault(require("../validators/user.validator"));
const validator_helper_1 = require("../../../helpers/validator.helper");
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/me', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, user_controller_1.default.getMe);
//
//  edit logged in user profile 
//
router.put('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.editProfile), user_controller_1.default.updateUserProfile);
//
//  members listing realted to same company of 
//  logged in user by company uuid
//
router.get('/members/:company_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.membersList), user_controller_1.default.membersList);
//
//  list of all invited members 
//
router.get('/invited', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, user_controller_1.default.invitedMembersList);
//
//  list of all invited members 
//
router.get('/sent_invite', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.sentInvitationValidator), user_controller_1.default.sentInvitedMembersList);
//
//  list of user organizations
//
router.get('/organization', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, user_controller_1.default.getUserOrganizationsList);
//
//  Accept decline invited members by user invitation uuid
//
router.put('/invited/:invitation_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.acceptDeclineInvitation), user_controller_1.default.acceptDeclineInvite);
//
//  Invite members on the basis of email
//
router.post('/invite', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.inviteMembers), user_controller_1.default.addMembers);
//
//  Invitation verificaiton
//
router.post('/invited/verify', (0, validator_helper_1.validator)(user_validator_1.default.inviteVerification), user_controller_1.default.inviteVerification);
//
//  list user management
//
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, user_controller_1.default.getUserList);
//
//  list all users
//
router.get('/all', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, user_controller_1.default.getAllUsersDetails);
//
//  get user details
//
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), user_controller_1.default.getUserDetailsByUuid);
//
//  update user status
//
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(user_validator_1.default.userStatusValidator), user_controller_1.default.updateUserStatus);
//
//  to save user language
//
router.patch('/language/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(user_validator_1.default.userLanguage), user_controller_1.default.saveUserLanguage);
//
//  to save user profile
//
router.post('/profile', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(user_validator_1.default.userProfile), user_controller_1.default.createUserProfile);
module.exports = router;
//# sourceMappingURL=user.route.js.map