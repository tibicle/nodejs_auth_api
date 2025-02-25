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
const team_controller_1 = __importDefault(require("../controllers/team.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const team_validator_1 = __importDefault(require("../validators/team.validator"));
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(team_validator_1.default.createTeamValidator), team_controller_1.default.createTeam);
router.delete('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), team_controller_1.default.deleteTeam);
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, team_controller_1.default.listTeam);
//
//  update team by team uuid
//
router.put('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(team_validator_1.default.updateTeamValidator), team_controller_1.default.updateTeam);
//
//  list all accepted team members by team uuid
//
router.get('/member/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.paginationSchema), (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), team_controller_1.default.listTeamMembers);
//
//  Remove team members by team members uuid
//
router.delete('/member/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), team_controller_1.default.removeTeamMembers);
//
//  Get team detail by team uuid
//
router.get('/detail/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), team_controller_1.default.getTeamDetails);
module.exports = router;
//# sourceMappingURL=team.route.js.map