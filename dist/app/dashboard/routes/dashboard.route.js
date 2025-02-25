"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
// Import Controllers
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const router = express_1.default.Router();
//
//  get dashboard team list
//
router.get('/team', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, dashboard_controller_1.default.getDashboardTeamList);
module.exports = router;
//# sourceMappingURL=dashboard.route.js.map