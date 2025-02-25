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
const user_repo_1 = __importDefault(require("../repos/user.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get list of user organizations
🗓 @created : 09/01/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const listUserOrganizations = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield user_repo_1.default.getUserOrganizationList(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            //  get user organizations list
            //
            const data = yield user_repo_1.default.getUserOrganizationList(container, 'organizationsData');
            const responseData = [];
            for (const response of data) {
                if (response.created_by == response.uuid) {
                    const resultData = {
                        organization_name: response.organization_name,
                        organization_uuid: response.organization_uuid,
                        owner: 'You',
                        file_url: response.file_url
                    };
                    responseData.push(resultData);
                }
                else if (response.organization_name != null) {
                    const resultData = {
                        organization_name: response.organization_name,
                        organization_uuid: response.organization_uuid,
                        owner: response.owner,
                        file_url: response.file_url
                    };
                    responseData.push(resultData);
                }
            }
            container.output.result = responseData;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = listUserOrganizations;
//# sourceMappingURL=listUserOrganizations.service.js.map