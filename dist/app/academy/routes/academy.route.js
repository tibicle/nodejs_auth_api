"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import Controllers
const academy_controller_1 = __importDefault(require("../controller/academy.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const academy_validator_1 = require("../validator/academy.validator");
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// save tutorial data
router.post('/tutorial', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.create), (0, validator_helper_1.validator)(academy_validator_1.academySchema.saveTutorialValidator), academy_controller_1.default.saveTutorial);
// get tutorial details
router.get('/tutorial', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.read), academy_controller_1.default.listTutorialDetails);
// get tutorial details
router.get('/tutorial/user', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.read), academy_controller_1.default.listUserTutorialDetails);
// update tutorial data
router.put('/tutorial', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.update), (0, validator_helper_1.validator)(academy_validator_1.academySchema.updateTutorialValidator), academy_controller_1.default.updateTutorial);
router.get('/tutorial/user/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.getUserTutorialDetailsByUuid);
// get tutorial details by uuid
router.get('/tutorial/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.getTutorialDetailsByUuid);
// publish tutorial
router.patch('/tutorial/publish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.publish), academy_controller_1.default.publishTutorial);
// unpublish tutorial
router.patch('/tutorial/unpublish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.publish), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.unpublishTutorial);
// update tutorial status
router.patch('/tutorial/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.tutorial_management.tutorial.publish), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(academy_validator_1.academySchema.tutorialStatusValidator), academy_controller_1.default.updateTutorialStatus);
// save module data
router.post('/module', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.create), (0, validator_helper_1.validator)(academy_validator_1.academySchema.saveModuleValidator), academy_controller_1.default.saveModule);
// get module details
router.get('/module', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.read), academy_controller_1.default.listModuleDetails);
// get module details
router.get('/module/user', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.read), academy_controller_1.default.listUserModuleDetails);
// update module data
router.put('/module', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.update), (0, validator_helper_1.validator)(academy_validator_1.academySchema.updateModuleValidator), academy_controller_1.default.updateModule);
// get user module details by uuid
router.get('/module/user/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.getUserModuleDetailsByUuid);
// get module details by uuid
router.get('/module/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.getModuleDetailsByUuid);
// publish module
router.patch('/module/publish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.publish), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.publishModule);
// unpublish module
router.patch('/module/unpublish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.publish), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), academy_controller_1.default.unpublishModule);
// update module status
router.patch('/module/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.module_management.module.publish), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(academy_validator_1.academySchema.moduleStatusValidator), academy_controller_1.default.updateModuleStatus);
module.exports = router;
//# sourceMappingURL=academy.route.js.map