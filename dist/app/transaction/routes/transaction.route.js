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
const transaction_controller_1 = __importDefault(require("../controller/transaction.controller"));
const transaction_validator_1 = __importDefault(require("../validators/transaction.validator"));
const app = express_1.default.Router();
//  list transaction
app.get("/", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, transaction_controller_1.default.listTransaction);
//  save transaction
app.post("/", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(transaction_validator_1.default.addTransaction), transaction_controller_1.default.saveTransaction);
//  update transaction
app.put("/", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(transaction_validator_1.default.addTransaction), transaction_controller_1.default.updateTransaction);
//  delete
app.delete("/:uuid", passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), transaction_controller_1.default.deleteTransaction);
module.exports = app;
//# sourceMappingURL=transaction.route.js.map