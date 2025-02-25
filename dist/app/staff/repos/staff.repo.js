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
class StaffRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save staff details
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveStaffDetails(staffDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [staffDetails] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .insert(staffDataModel)
                    .returning('uuid');
                return staffDetails;
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
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all staff details with total count
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllStaffData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let staffQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .select('u.uuid', 'u.email', database_1.default.raw("CONCAT_WS(' ',u.first_name,u.last_name) as name"), 'u.mobile_no', 'u.created_at', 'r.name as role')
                    .select(database_1.default.raw("CONCAT_WS(' ',us.first_name,us.last_name) as added_by"))
                    .select(database_1.default.raw("CONCAT_WS(' ',uss.first_name,uss.last_name) as updated_by"))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'u.created_by', 'us.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uss`, 'u.updated_by', 'uss.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`, 'ur.user_uuid', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as r`, 'r.uuid', 'ur.role_uuid')
                    .whereIn('r.code', [constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR, constant_1.default.system_roles.VF_ADMIN_CLIENT_MANAGER, constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER])
                    .andWhere('u.status', constant_1.default.status.ACTIVE);
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listStaffFilters(container, staffQuery);
                    let results = yield staffQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'staffData') {
                    staffQuery
                        .select('u.uuid', 'u.email', database_1.default.raw("CONCAT_WS(' ',u.first_name,u.last_name) as name"), 'u.mobile_no', 'u.created_at', 'r.name as role')
                        .select(database_1.default.raw("CONCAT_WS(' ',us.first_name,us.last_name) as added_by"));
                    //
                    //  search filter 
                    //
                    this.listStaffFilters(container, staffQuery);
                    if (query.per_page &&
                        query.page) {
                        staffQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        staffQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield staffQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses :
    🗓 @created :
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listStaffFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.name.toLowerCase()}%'`);
                }
                //
                //  filter by type
                //
                if (query.email) {
                    searchQuery.andWhere('u.email', `${query.email}`);
                }
                if (query.mobile_no) {
                    searchQuery.andWhere('u.mobile_no', `${query.mobile_no}`);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get staff roles
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getStaffRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staffRoles = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE}`)
                    .select('uuid', 'name')
                    .whereIn('code', [constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR, constant_1.default.system_roles.VF_ADMIN_CLIENT_MANAGER, constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER]);
                return staffRoles;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update staff details
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaffDetails(userUuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staffDetails = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .update(updateDataModel)
                    .where('uuid', userUuid);
                return staffDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get staff details by uuid
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getStaffDetailsByUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [staffDetails] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .select('u.uuid', 'u.first_name', 'u.last_name', 'u.email', 'u.mobile_no', 'r.name as role', 'ur.role_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`, 'ur.user_uuid', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as r`, 'r.uuid', 'ur.role_uuid')
                    .where('u.uuid', userUuid);
                return staffDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new StaffRepo();
//# sourceMappingURL=staff.repo.js.map