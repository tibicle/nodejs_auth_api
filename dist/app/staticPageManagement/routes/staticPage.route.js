"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import Controllers
const staticPage_controller_1 = __importDefault(require("../controllers/staticPage.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const staticPage_validator_1 = require("../validators/staticPage.validator");
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// save static page data
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(staticPage_validator_1.staticPageSchema.saveStaticPageValidator), staticPage_controller_1.default.saveStaticPage);
// get static page details
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, staticPage_controller_1.default.listStaticPageDetails);
// update static page data
router.put('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(staticPage_validator_1.staticPageSchema.updateStaticPageValidator), staticPage_controller_1.default.updateStaticPage);
// get static page details by uuid
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), staticPage_controller_1.default.getStaticPageDetailsByUuid);
// update static page status
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(staticPage_validator_1.staticPageSchema.staticPageStatusValidator), staticPage_controller_1.default.updateStaticPageStatus);
module.exports = router;
//# sourceMappingURL=staticPage.route.js.map