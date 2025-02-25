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
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
class authRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : store signup details in database
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertUserDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .insert(data)
                    .returning('*');
                return userData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : store signup details in database
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertCompanyDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companyData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .insert(data)
                    .returning('*');
                return companyData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Insert details in user_company table
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertUserCompanyDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`).insert(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Get role details of owner
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getRoleData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [roleData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`).where('code', constant_1.default.system_roles.USER);
                return roleData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Insert role details of owner in user_role table
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertUserRoleDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE}`).insert(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : save random code to the database hashpassword column and expiry time
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveRandomCode(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, body }, derived: { user, randomCode, expiryTime } } = container;
                const saveHashPassword = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('email', user.email)
                    .update({ 'reset_hash': randomCode });
                const saveExpiryTime = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('email', user.email)
                    .update({ 'expiry_time': expiryTime });
                return [saveHashPassword, saveExpiryTime];
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Get Expiry time of the user
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExpiryTime(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [expiryTime] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('reset_hash', code);
                return expiryTime;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Save updated user password in database
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updatePassword(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, body }, derived: { user, password } } = container;
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('reset_hash', body.code)
                    .update('password', password);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : updated hash password and expiry time to null
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateHashPasswordExpiryTime(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, body }, derived: { user, password } } = container;
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('reset_hash', body.code)
                    .update('reset_hash', null)
                    .update('expiry_time', null);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : change user new password in database
    🗓 @created : 9/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    changePassword(uuid, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('uuid', uuid)
                    .update('password', newPassword);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : to get user password by uuid
      🗓 @created : 15/11/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    getUserPassword(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .select('password')
                    .where('uuid', uuid);
                if (!user) {
                    const err = new Error(i18n.__('no_user_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update is verify email status to true
    🗓 @created : 09/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateVerifyEmailStatus(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, body }, derived: { user, password } } = container;
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('reset_hash', body.code)
                    .update('is_email_verified', true);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : updated reset hash and expiry time to null
   🗓 @created : 09/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    updateResetHashAndExpiryTime(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, body }, derived: { user, password } } = container;
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('reset_hash', body.code)
                    .update('reset_hash', null)
                    .update('expiry_time', null);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Get role details of owner
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getOwnerRoleData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [roleData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`).where('code', constant_1.default.system_roles.OWNER);
                return roleData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Get Expiry time by
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getResetHashByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('email', email);
                return userData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : save random code to the database hashpassword column and expiry time
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveResendRandomCode(resendCodeModel, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveHashPassword = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .update(resendCodeModel)
                    .where('email', email);
                return saveHashPassword;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new authRepo();
//# sourceMappingURL=auth.repos.js.map