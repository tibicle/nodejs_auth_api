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
// Import Static
// Import Middleware
// Import services
// Import Helpers
const auth_helper_1 = __importDefault(require("../helper/auth.helper"));
// Import Repos
const auth_repos_1 = __importDefault(require("../repos/auth.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : change password service
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const changePasswordService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  check old password is related to logged in user
        //
        yield checkOldPassword(container);
        //
        //  covert password in hased password
        //
        yield convertToHashedPassword(container);
        //
        //  store changed password in user database
        //
        yield storeNewPassword(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check old password is matched or not with logged in user
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkOldPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  get user detials by logged in user uuid
        //
        const userPassword = yield auth_repos_1.default.getUserPassword(logged_in_user.uuid);
        //
        //  compare old password with the stored password
        //
        const comparePassword = yield auth_helper_1.default.comparePassword(body.old_password, userPassword.password);
        if (!comparePassword) {
            const err = new Error(i18n_1.default.__("auth.old_password_not_matched"));
            err.statusCode = 400;
            throw err;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : convert new password in hashed password
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const convertToHashedPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user } } = container;
        //
        // convert new password in hased password
        //
        container.derived.newHashedPassword = yield auth_helper_1.default.createHashedPassword(body.password);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check old password is matched or not with logged in user
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeNewPassword = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, derived: { newHashedPassword } } = container;
        //
        //  store new password in database
        //
        yield auth_repos_1.default.changePassword(logged_in_user.uuid, newHashedPassword);
        container.output.message = i18n_1.default.__('auth.password_changed_successfully');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = changePasswordService;
//# sourceMappingURL=changePassword.service.js.map