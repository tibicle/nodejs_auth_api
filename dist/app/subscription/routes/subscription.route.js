"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Libraries
const express_1 = __importDefault(require("express"));
// Import Helpers
const validator_helper_1 = require("../../../helpers/validator.helper");
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const subscription_controller_1 = __importDefault(require("../controller/subscription.controller"));
const subscription_validator_1 = __importDefault(require("../validators/subscription.validator"));
const app = express_1.default.Router();
//get all subscriptions
app.get("/", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, subscription_controller_1.default.getAllSubscription);
//get all user subscription subscriptions
app.get("/list", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, subscription_controller_1.default.listAllUsersSubscription);
//get subscription details
app.get("/current", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.getCurrentSubscription), subscription_controller_1.default.getCurrentSubscription);
//get user subscription details by uuid
app.get("/user_subscription/:user_subscription_uuid", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.userSubscriptionUuidSchema), subscription_controller_1.default.getUserSubscriptionDetails);
//get subscription details
app.get("/:uuid", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), subscription_controller_1.default.getSubscription);
//  Buy subscription
app.post("/buy", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.buySubscription), subscription_controller_1.default.buySubscription);
//  addon subscription
app.post("/add_on", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.addOnSubscription), subscription_controller_1.default.addOnSubscription);
//  renew subscription
app.post("/renew", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.renewSubscription), subscription_controller_1.default.renewSubscription);
//  upgrade subscription
app.post("/upgrade", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.upgradeSubscription), subscription_controller_1.default.upgradeSubscription);
// cancel subscription
app.put("/cancel", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(subscription_validator_1.default.cancelSubscription), subscription_controller_1.default.cancelSubscription);
module.exports = app;
//# sourceMappingURL=subscription.route.js.map