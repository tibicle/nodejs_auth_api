"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
// Import Controllers
const aiAssistant_controller_1 = __importDefault(require("../controllers/aiAssistant.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const thread_validator_1 = __importDefault(require("../validators/thread.validator"));
const router = express_1.default.Router();
//
//  to store thread_id
//
router.post('/message', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(thread_validator_1.default.threadValidator), aiAssistant_controller_1.default.storeThread);
//
//  kiosk API
//
router.post('/kiosk', (0, validator_helper_1.validator)(thread_validator_1.default.kioskValidator), aiAssistant_controller_1.default.kioskApi);
//
// to get thread
//
router.get('/message', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(thread_validator_1.default.threadIdValidator), aiAssistant_controller_1.default.getThread);
module.exports = router;
//# sourceMappingURL=aiAssistant.route.js.map