'use strict';
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
// Import Helpers
// Import validations
// Import Interface 
// Import Libraries
// Import Repos
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const userRole_repo_1 = __importDefault(require("../../user/repos/userRole.repo"));
const defaultPermission_1 = __importDefault(require("../../../config/defaultPermission"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update staff status service
🗓 @created : 23/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStaffStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params }, derived: {} } = container;
        //
        //  check user exists
        //
        container.derived.user = yield user_repo_1.default.getUserByUuid(params.uuid);
        //
        //  update the user status
        //
        yield updateStatus(container);
        container.output.message = i18n_1.default.__('staff.status_update');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update status
🗓 @created : 23/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, }, derived: { user } } = container;
        //
        // Prepare the batch request
        //
        const userPermissionModelData = [];
        //
        // Temp permission data to check only
        //
        const tempPermissionData = [];
        //
        //  get role
        //
        const roleData = yield userRole_repo_1.default.getRole();
        if (roleData) {
            for (let role of roleData) {
                if (role.code == 'team_manager' || role.code == 'team_owner' || role.code == 'team_member') {
                    continue;
                }
                else {
                    //
                    //  check that is there any role present in the user role table
                    //
                    const userRoleData = yield userRole_repo_1.default.getRoleByRoleUuid(role.uuid, user.uuid);
                    if (userRoleData) {
                        yield userRole_repo_1.default.deleteUserRole(role.uuid, user.uuid);
                    }
                    const userRole = role.code;
                    const userPermission = defaultPermission_1.default.role_permission[userRole];
                    if (userPermission) {
                        for (const per of userPermission) {
                            yield userRole_repo_1.default.deleteUserPermission(per, user.uuid);
                        }
                    }
                }
            }
        }
        //
        // get role details of user
        //
        const roleUser = yield userRole_repo_1.default.getRoleByName('user');
        const userPermissionRole = defaultPermission_1.default.role_permission[roleUser.code];
        //
        //  prepare data model to save the role
        //
        const roleDataModel = {
            user_uuid: user.uuid,
            role_uuid: roleUser.uuid
        };
        //
        //  save staff role
        //
        yield userRole_repo_1.default.saveUserRoleData(roleDataModel);
        for (const per of userPermissionRole) {
            if (tempPermissionData.includes(per)) {
                continue;
            }
            else {
                userPermissionModelData.push({
                    user_uuid: user.uuid,
                    action_code: per,
                    is_allow: true,
                    updated_by: logged_in_user.uuid,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                });
            }
        }
        //
        //  insert user permission
        //  
        const saveUserPermission = yield user_repo_1.default.insertUserPermission(userPermissionModelData);
        //
        //  Prepare the model to update status
        //
        const updateStatusDataModel = {
            status: 'ACTIVE',
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  update the user status
        //
        container.derived.user = yield user_repo_1.default.updateStatus(params.uuid, updateStatusDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateStaffStatus;
//# sourceMappingURL=updateStaffStatus.service.js.map