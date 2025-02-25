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
const tutorial_controller_1 = __importDefault(require("../controllers/tutorial.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const tutorial_validator_1 = require("../validators/tutorial.validator");
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// save tutorial data
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(tutorial_validator_1.tutorialSchema.saveTutorialValidator), tutorial_controller_1.default.saveTutorial);
// get tutorial details
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, tutorial_controller_1.default.listTutorialDetails);
// update tutorial data
router.put('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(tutorial_validator_1.tutorialSchema.updateTutorialValidator), tutorial_controller_1.default.updateTutorial);
// get tutorial details by uuid
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), tutorial_controller_1.default.getTutorialDetailsByUuid);
// publish tutorial
router.patch('/publish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), tutorial_controller_1.default.publishTutorial);
// unpublish tutorial
router.patch('/unpublish/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), tutorial_controller_1.default.unpublishTutorial);
// update tutorial status
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(tutorial_validator_1.tutorialSchema.tutorialStatusValidator), tutorial_controller_1.default.updateTutorialStatus);
module.exports = router;
//# sourceMappingURL=tutorial.route.js.map