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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
const http_status_codes_1 = require("http-status-codes");
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
class UserRoleRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get user role by uuid
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getRoleByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`)
                    .select('ur.*', 'r.name', 'r.code')
                    .innerJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as r`, 'r.uuid', 'ur.role_uuid')
                    .where('ur.user_uuid', userUuid);
                if (!userRoles) {
                    const err = new Error(i18n_1.default.__('no_user_role_defined'));
                    err.statusCode = http_status_codes_1.StatusCodes.UNAUTHORIZED;
                    throw err;
                }
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to save user role
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveUserRoleData(userRoleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE}`)
                    .insert(userRoleData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check role exists or not
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkRole(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [role] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`)
                    .where('uuid', uuid);
                if (!role) {
                    const err = new Error(i18n_1.default.__('role.no_role_exists'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                return role;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user role
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserRole(userUuid, userRoleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateRole = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE}`)
                    .update(userRoleData)
                    .where('user_uuid', userUuid);
                return updateRole;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check user role
    🗓 @created : 29/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkUserRole(roleUuid, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkRole] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE}`)
                    .where('role_uuid', roleUuid)
                    .andWhere('user_uuid', userUuid);
                return checkRole;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : to get user role by uuid
   🗓 @created : 20/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getRoleByRoleUuid(roleUuid, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`)
                    .select('ur.uuid')
                    .where('ur.user_uuid', userUuid)
                    .andWhere('ur.role_uuid', roleUuid);
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : to get user role by uuid
   🗓 @created : 20/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getRole() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`)
                    .select('uuid', 'code');
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : to get user role by uuid
   🗓 @created : 20/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    deleteUserRole(roleUuid, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE}`)
                    .where('user_uuid', userUuid)
                    .andWhere('role_uuid', roleUuid)
                    .del();
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : to get user role by uuid
   🗓 @created : 20/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    deleteUserPermission(actionCode, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where('action_code', actionCode)
                    .andWhere('user_uuid', userUuid)
                    .del();
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get user role by name
    🗓 @created : 04//2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getRoleByName(roleCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userRoles] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`)
                    .whereRaw('LOWER(code) = LOWER(?)', [roleCode]);
                return userRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new UserRoleRepo();
//# sourceMappingURL=userRole.repo.js.map