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
exports.Permission = void 0;
// Import Config
const constant_1 = __importDefault(require("../config/constant"));
// Import Static
// Import Middleware
// Import Interface
// Import Validators
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
const userPermission_repo_1 = __importDefault(require("../app/userPermission/repos/userPermission.repo"));
const response_helper_1 = __importDefault(require("../helpers/response.helper"));
class Permission {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check permission against user and action code
    🗓 @created : 09/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    static isActionPermission(actionCode) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                //
                // Allow if user contain the SUPER_ADMIN Role
                //
                if (req.logged_in_user.roles.indexOf(constant_1.default.system_roles.SUPER_ADMIN) > -1 || req.logged_in_user.roles.indexOf(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR) > -1) {
                    return next();
                }
                //
                // check is action allowed
                //
                yield userPermission_repo_1.default.isUserActionAllowed(req.logged_in_user.uuid, actionCode);
                return next();
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.Permission = Permission;
//# sourceMappingURL=permissionLibrary.js.map