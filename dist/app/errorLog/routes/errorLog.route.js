"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
// Import Controllers
const errorLog_controller_1 = __importDefault(require("../controllers/errorLog.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const errorLog_validator_1 = require("../validators/errorLog.validator");
// Import Helpers
// Import Transformers
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const router = express_1.default.Router();
//
//  get error logs
//
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.error_log_management.error_log.read), errorLog_controller_1.default.listErrorLogs);
//
//  download error file
//
router.get('/:uuid', permissionLibrary_1.Permission.isActionPermission(permission_1.default.error_log_management.error_log.read), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), errorLog_controller_1.default.downloadErrorFile);
//
//  Update error log status
//
router.patch('/:uuid/status', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.error_log_management.error_log.update), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(errorLog_validator_1.errorLogSchema.errorLogStatusValidator), errorLog_controller_1.default.updateErrorLogStatus);
module.exports = router;
//# sourceMappingURL=errorLog.route.js.map