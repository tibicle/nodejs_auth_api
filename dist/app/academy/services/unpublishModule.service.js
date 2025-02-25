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
const permission_1 = __importDefault(require("../../../config/permission"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Helpers
// Import validations
// Import Interface 
// Import Libraries
// Import Repos
const academy_repo_1 = __importDefault(require("../repo/academy.repo"));
const userPermission_repo_1 = __importDefault(require("../../userPermission/repos/userPermission.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : unpublish module service
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const unpublishModuleService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user }, derived: {} } = container;
        //
        //  check module exists or not
        //
        yield academy_repo_1.default.checkModuleByUuid(params.uuid);
        //
        //  check permission  
        //
        yield checkPublishPermission(container);
        //
        //  unpublish module
        //
        yield unpublishModule(container);
        container.output.message = i18n_1.default.__('module.status_update');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : check publish permission
🗓 @created : 15/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkPublishPermission = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN)) && !(logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR))) {
            //
            // get logged in user permission
            //
            const createPermission = yield userPermission_repo_1.default.getUserPermission(logged_in_user.uuid);
            var checkPublishPermission = createPermission.find((item) => {
                if (item.action_code == permission_1.default.tutorial_management.tutorial.publish &&
                    item.is_allow == true) {
                    return item;
                }
            });
            if (!checkPublishPermission) {
                const err = new Error(i18n_1.default.__(`approval_permission_message.${permission_1.default.tutorial_management.tutorial.publish}`));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : unpublish module
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const unpublishModule = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        //
        //  Prepare the model to update status
        //
        const updateStatusDataModel = {
            status: constant_1.default.tutorial_status.UNPUBLISHED,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  update the module status
        //
        yield academy_repo_1.default.updateModuleDetails(params.uuid, updateStatusDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = unpublishModuleService;
//# sourceMappingURL=unpublishModule.service.js.map