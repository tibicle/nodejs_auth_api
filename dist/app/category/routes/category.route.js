"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Validators
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const router = express_1.default.Router();
//
//get category list
//
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, category_controller_1.default.getCategory);
module.exports = router;
//# sourceMappingURL=category.route.js.map