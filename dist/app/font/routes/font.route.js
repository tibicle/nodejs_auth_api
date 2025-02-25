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
const font_controller_1 = __importDefault(require("../controllers/font.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const font_validator_1 = require("../validator/font.validator");
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// save font data
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(font_validator_1.fontSchema.saveFontValidator), font_controller_1.default.addFont);
// list font details
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, font_controller_1.default.listFont);
// get all fonts
router.get('/all', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, font_controller_1.default.getAllFonts);
// update font status
router.patch('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(font_validator_1.fontSchema.fontStatusValidator), font_controller_1.default.updateFontStatus);
// update font details
router.put('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(font_validator_1.fontSchema.updatefontValidator), font_controller_1.default.updateFontDetails);
module.exports = router;
//# sourceMappingURL=font.route.js.map