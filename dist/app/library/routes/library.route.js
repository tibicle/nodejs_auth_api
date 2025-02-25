"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
// Import Controllers
const library_controller_1 = __importDefault(require("../controller/library.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const library_validator_1 = require("../validator/library.validator");
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
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.library_management.library.read), (0, validator_helper_1.validator)(library_validator_1.libraryList), library_controller_1.default.listLibrary);
//
//get library file
//
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), library_controller_1.default.getLibraryFileDetails);
//
//update library file
//
router.put('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.library_management.library.update), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(library_validator_1.updateLibraryFileDetails.updateLibraryFile), library_controller_1.default.updateLibraryFileDetails);
//  
//  delete library file
//
router.delete('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.library_management.library.delete), (0, validator_helper_1.validator)(library_validator_1.deleteLibraryFile.deleteLibrary), library_controller_1.default.deleteLibrary);
module.exports = router;
//# sourceMappingURL=library.route.js.map