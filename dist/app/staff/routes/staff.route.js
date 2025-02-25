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
const staff_controller_1 = __importDefault(require("../controllers/staff.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const staff_validator_1 = require("../validators/staff.validator");
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// save staff details
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.staff_management.staff.create), (0, validator_helper_1.validator)(staff_validator_1.staffSchema.addStaffValidator), staff_controller_1.default.addStaff);
// get staff details
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.staff_management.staff.read), staff_controller_1.default.listStaffDetails);
// get staff roles
router.get('/roles', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, staff_controller_1.default.getStaffRoles);
// update staff details
router.put('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.staff_management.staff.update), (0, validator_helper_1.validator)(staff_validator_1.staffSchema.updateStaffValidator), staff_controller_1.default.updateStaff);
// get staff details by uuid
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), staff_controller_1.default.getStaffDetailsByUuid);
// update satff status
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.staff_management.staff.update), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(staff_validator_1.staffSchema.staffStatusValidator), staff_controller_1.default.updateStaffStatus);
module.exports = router;
//# sourceMappingURL=staff.route.js.map