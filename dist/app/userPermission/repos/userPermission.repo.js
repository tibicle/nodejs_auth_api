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
// import { UserPermissionArrayInterface } from '../../../interface/userPermissionInterface'; 
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class UserPermissionRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to check is action allowed
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    isUserActionAllowed(userUuid, actionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userPermission] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where({
                    'user_uuid': userUuid,
                    'action_code': actionCode,
                    'is_allow': true
                });
                if (!userPermission) {
                    const err = new Error(i18n_1.default.__('no_action_allowed'));
                    err.statusCode = http_status_codes_1.default.FORBIDDEN;
                    throw err;
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : batch insert user permision
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveBatchUserPermission(userPermissionModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default.batchInsert(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`, userPermissionModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserPermission(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where({
                    'user_uuid': userUuid
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserPermission(uuid, userPermissionModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where('uuid', uuid)
                    .update(userPermissionModelData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save user permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveUserPermission(userPermissionModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .insert(userPermissionModelData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deletePermission(user_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where('user_uuid', user_uuid)
                    .del();
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get the user permission based on search condition
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    searchUserPermission(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where(condition);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user allowed permission
    🗓 @created : 19/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserAllowedPermission(logged_in_user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allowedPermissions = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .distinct('action_code');
                if (!logged_in_user.roles.includes('super_admin')) {
                    allowedPermissions.where('user_uuid', logged_in_user.uuid)
                        .where('is_allow', true);
                }
                return yield allowedPermissions;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new UserPermissionRepo();
//# sourceMappingURL=userPermission.repo.js.map