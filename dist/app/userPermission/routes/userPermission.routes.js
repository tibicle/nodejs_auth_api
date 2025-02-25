"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import Controllers
const userPermission_controller_1 = __importDefault(require("../controllers/userPermission.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const userPermission_validator_1 = __importDefault(require("../validators/userPermission.validator"));
// Import Helpers
// Import Transformers
// Import Libraries
// import { Permission } from "../../../library/permissionLibrary";
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//User profile picture route
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, userPermission_controller_1.default.userPermission);
//User allowed permission
router.get('/allowed', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, userPermission_controller_1.default.userAllowedPermission);
//User permission by uuid
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), userPermission_controller_1.default.userPermissionByUuid);
//Upsert User permission
router.put('/:user_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.userUuidSchema), (0, validator_helper_1.validator)(userPermission_validator_1.default.updatePermission), userPermission_controller_1.default.upsertUserPermission);
module.exports = router;
//# sourceMappingURL=userPermission.routes.js.map