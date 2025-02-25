"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
// Import Controllers
const company_controller_1 = __importDefault(require("../controllers/company.controller"));
// Import Interface
// Import Validators
const company_validator_1 = __importDefault(require("../validators/company.validator"));
const validator_helper_1 = require("../../../helpers/validator.helper");
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
router.get('/verify', (0, validator_helper_1.validator)(company_validator_1.default.companyValidator), company_controller_1.default.CompanyVerify);
//
// get company details by company uuid
//
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), company_controller_1.default.getCompanyDetails);
//
// update company details
//
router.put('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.organization_management.organization.update), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(company_validator_1.default.updateCompanyValidator), company_controller_1.default.updateCompanyDetails);
//
// create company profile
//
router.post('/profile', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(company_validator_1.default.companyProfile), company_controller_1.default.createCompanyProfile);
//
// delete company logo
//
router.delete('/logo', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(company_validator_1.default.companyLogo), company_controller_1.default.deleteCompanyLogo);
module.exports = router;
//# sourceMappingURL=company.route.js.map