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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const userRole_repo_1 = __importDefault(require("../../user/repos/userRole.repo"));
const staff_repo_1 = __importDefault(require("../repos/staff.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const defaultPermission_1 = __importDefault(require("../../../config/defaultPermission"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update staff service
🗓 @created : 22/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStaffService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  check user exists or not
        //
        const userUuid = yield user_repo_1.default.getUserByUuid(body.user_uuid);
        //
        //  check if email to update exists or not
        //
        const userEmail = yield user_repo_1.default.getUserByEmail(body.email);
        if (userEmail && userUuid.uuid != userEmail.uuid) {
            const err = new Error(i18n_1.default.__('user.email_bind_another_user'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  validate role uuid
        //
        yield userRole_repo_1.default.checkRole(body.role_uuid);
        //
        //  update staff details
        //
        yield updateStaffDetails(container);
        container.output.message = i18n_1.default.__('staff.update_staff');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update staff details
🗓 @created : 22/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStaffDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { password } } = container;
        //
        //  prepare data model to update staff details
        //
        const staffDataModel = {
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            mobile_no: body.mobile_no,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_by: logged_in_user.uuid
        };
        //
        //  update staff details
        //
        yield staff_repo_1.default.updateStaffDetails(body.user_uuid, staffDataModel);
        // Prepare the batch request
        //
        const userPermissionModelData = [];
        //
        // Temp permission data to check only
        //
        const tempPermissionData = [];
        //
        //  get role by uuid
        //
        const role = yield userRole_repo_1.default.checkRole(body.role_uuid);
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
                    const userRoleData = yield userRole_repo_1.default.getRoleByRoleUuid(role.uuid, body.user_uuid);
                    if (userRoleData) {
                        yield userRole_repo_1.default.deleteUserRole(role.uuid, body.user_uuid);
                    }
                    const userRole = role.code;
                    const userPermission = defaultPermission_1.default.role_permission[userRole];
                    if (userPermission) {
                        for (const per of userPermission) {
                            yield userRole_repo_1.default.deleteUserPermission(per, body.user_uuid);
                        }
                    }
                }
            }
            //
            //  prepare data model to save the role
            //
            const roleDataModel = {
                user_uuid: body.user_uuid,
                role_uuid: body.role_uuid
            };
            //
            //  save staff role
            //
            yield userRole_repo_1.default.saveUserRoleData(roleDataModel);
            const userRole = role.code;
            const userPermission = defaultPermission_1.default.role_permission[userRole];
            for (const per of userPermission) {
                userPermissionModelData.push({
                    user_uuid: body.user_uuid,
                    action_code: per,
                    is_allow: true,
                    updated_by: logged_in_user.uuid,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                });
                tempPermissionData.push(per);
            }
            const roleUser = yield userRole_repo_1.default.getRoleByName('user');
            const userPermissionRole = defaultPermission_1.default.role_permission[roleUser.code];
            for (const per of userPermissionRole) {
                if (tempPermissionData.includes(per)) {
                    continue;
                }
                else {
                    userPermissionModelData.push({
                        user_uuid: body.user_uuid,
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
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateStaffService;
//# sourceMappingURL=updateStaff.service.js.map