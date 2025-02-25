"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import services
const auth_helper_1 = __importDefault(require("../helper/auth.helper"));
const auth_repos_1 = __importDefault(require("../repos/auth.repos"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : reset user password service
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const resetUserPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        i18n_1.default.setLocale('nl');
        //
        //  check user reset_hash and expiry time is valid or not
        //
        yield validateExpiryTime(container);
        //
        //  update user password
        //
        yield updatePassword(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate expiry time
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateExpiryTime = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //get user Expiry time from database and match with current time by using code from body
        //
        const userExpiryTime = yield auth_repos_1.default.getExpiryTime(body.code);
        //
        //get current time 
        //
        const currentTime = moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss");
        if (!userExpiryTime) {
            const err = new Error(i18n_1.default.__("auth.code_invalid"));
            err.statusCode = 400;
            throw err;
        }
        else if ((0, moment_timezone_1.default)(currentTime) > (0, moment_timezone_1.default)(userExpiryTime.expiry_time)) {
            const err = new Error(i18n_1.default.__("auth.time_expired"));
            err.statusCode = 400;
            throw err;
        }
        container.derived.user = userExpiryTime;
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update user new password and save to database
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updatePassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, derived: { user } } = container;
        //
        //convert user password in hashed password
        //
        container.derived.password = yield auth_helper_1.default.createHashedPassword(body.password);
        //
        //save updated user password in database
        //
        yield auth_repos_1.default.updatePassword(container);
        //
        //update reset_hash and expiry time to null
        //
        yield auth_repos_1.default.updateHashPasswordExpiryTime(container);
        container.output.message = i18n_1.default.__('auth.password_changed_successfully');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = resetUserPassword;
//# sourceMappingURL=resetPassword.sevice.js.map