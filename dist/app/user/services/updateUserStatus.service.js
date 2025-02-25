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
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const organization_repo_1 = __importDefault(require("../../organization/repos/organization.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update user status service
🗓 @created : 26/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateUserStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
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
        container.output.message = i18n_1.default.__('user.status_updated');
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
🗓 @created : 26/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        //
        // get all company details, logged_in_user is the owner
        //
        const companyDetails = yield company_repos_1.default.getCompanyDetailsByUserUuid(params.uuid);
        //
        // update company status also related to logged_in_user 
        //
        for (let company of companyDetails) {
            if (company.created_by == params.uuid) {
                //
                //  Prepare the model to update status
                //
                const updateStatusDataModel = {
                    status: body.status,
                    updated_by: logged_in_user.uuid,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
                //
                //  update the organization status
                //
                yield organization_repo_1.default.updateOrganizationDetails(company.uuid, updateStatusDataModel);
            }
        }
        //
        //  Prepare the model to update status
        //
        const updateStatusDataModel = {
            status: body.status,
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
exports.default = updateUserStatus;
//# sourceMappingURL=updateUserStatus.service.js.map