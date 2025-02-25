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
const permission_1 = __importDefault(require("../../../config/permission"));
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
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const userPermission_repo_1 = __importDefault(require("../repos/userPermission.repo"));
// Import Thirdparty
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : to get user permission
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserPermission = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params } } = container;
        //
        // Is user valid
        //
        yield user_repo_1.default.getUserByUuid(params.uuid);
        //
        // get user permission
        //
        yield getUserPermissionData(container);
        //
        // transform the response
        //
        yield prepareResponse(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get user permission by uuid
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserPermissionData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params } } = container;
        //
        // get the permission
        //
        const userPermission = yield userPermission_repo_1.default.getUserPermission(params.uuid);
        container.derived.userPermission = userPermission;
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : prepare the response
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const prepareResponse = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user }, derived: { userPermission } } = container;
        let permissionGroup;
        if (userPermission) {
            permissionGroup = (0, lodash_groupby_1.default)(userPermission, 'action_code');
        }
        let modulePermission = [];
        for (const module in permission_1.default) {
            let moduleGroup = {
                module_name: i18n_1.default.__(`permission.${module}`),
                permission: []
            };
            for (const subModule in permission_1.default[module]) {
                let submoduleGroup = {
                    module_name: i18n_1.default.__(`permission.${subModule}`),
                    permission: []
                };
                //
                // Iterate for individual permission
                //
                for (const subModulePer in permission_1.default[module][subModule]) {
                    let isAllow = false;
                    let actionCode = permission_1.default[module][subModule][subModulePer];
                    if (permission_1.default[module][subModule][subModulePer] in permissionGroup &&
                        permissionGroup[permission_1.default[module][subModule][subModulePer]][0]) {
                        isAllow = permissionGroup[permission_1.default[module][subModule][subModulePer]][0].is_allow;
                    }
                    let subPermissionGroup = {
                        permission_name: i18n_1.default.__(`permission.${subModulePer}`),
                        is_allow: isAllow,
                        action_code: actionCode
                    };
                    submoduleGroup.permission.push(subPermissionGroup);
                }
                moduleGroup.permission.push(submoduleGroup);
            }
            if (moduleGroup.module_name != "Settings") {
                modulePermission.push(moduleGroup);
            }
        }
        container.output.result = modulePermission;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getUserPermission;
//# sourceMappingURL=getUserPermission.service.js.map