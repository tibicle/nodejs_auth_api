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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Validators
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
const userPermission_repo_1 = __importDefault(require("../repos/userPermission.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const moment_1 = __importDefault(require("moment"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update user permission service
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateUserPermission = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        // validate user
        //
        yield user_repo_1.default.getUserByUuid(params.user_uuid);
        //
        // upsert the permission
        //
        yield upsertUserPermission(container);
        //
        // store result into container
        //
        container.output.message = i18n_1.default.__(`permission.permission_update_success`);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : upsert user permission
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const upsertUserPermission = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  get the permission
        //
        let condition = {
            user_uuid: params.user_uuid,
            action_code: body.action_code
        };
        const [userPermission] = yield userPermission_repo_1.default.searchUserPermission(condition);
        const userPermissionModelData = {
            is_allow: body.is_allow,
            user_uuid: params.user_uuid,
            action_code: body.action_code,
            updated_by: logged_in_user.uuid,
            updated_at: moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        if (userPermission) {
            yield userPermission_repo_1.default.updateUserPermission(userPermission.uuid, userPermissionModelData);
        }
        else {
            yield userPermission_repo_1.default.saveUserPermission(userPermissionModelData);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateUserPermission;
//# sourceMappingURL=upsertUserPermission.service.js.map