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
// Import Thirdparty
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get user allowed permission
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserAllowedPermission = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params } } = container;
        //
        // get user permission
        //
        yield getUserAllowedPermissionData(container);
        // 
        // prepare response 
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
🚩 @uses : get user allowed permission data
🗓 @created : 19/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserAllowedPermissionData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user } } = container;
        //
        // get the permission
        //
        const userPermission = yield userPermission_repo_1.default.getUserAllowedPermission(logged_in_user);
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
        const { derived: { userPermission } } = container;
        const userAllowedPermissions = [];
        userPermission.map((permission) => {
            userAllowedPermissions.push(permission.action_code);
        });
        container.output.result = userAllowedPermissions;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getUserAllowedPermission;
//# sourceMappingURL=getUserAllowedPermission.service.js.map