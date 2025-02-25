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
const organization_controller_1 = __importDefault(require("../controllers/organization.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const organization_validator_1 = require("../validators/organization.validator");
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// get organization list
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.organization_management.organization.read), organization_controller_1.default.listOrganizationDetails);
//
//  get all the organization list
//
router.get('/all', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, organization_controller_1.default.listAllOrganizationDetails);
// get organization details by uuid
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, 
//Permission.isActionPermission(permission.organization_management.organization.read),
(0, validator_helper_1.validator)(validator_helper_1.uuidSchema), organization_controller_1.default.getOrganizationDetailsByUuid);
// update organization status
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.organization_management.organization.update), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(organization_validator_1.organizationSchema.organizationStatusValidator), organization_controller_1.default.updateOrganizationStatus);
module.exports = router;
//# sourceMappingURL=organization.route.js.map