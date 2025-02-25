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
const user_repo_1 = __importDefault(require("../repos/user.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : members list API service
* 🗓 Created : 21/11/2023
*/
const membersListService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  validate company exist or not
        //
        yield validateCompany(container);
        //
        //  get all users list as a members of same company of logged in user
        //
        yield getAllMembers(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : validate company exist or not
* 🗓 Created : 21/11/2023
*/
const validateCompany = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  check company exist or not
        //
        const companyData = yield company_repos_1.default.getCompanyDetailsByUuid(params.company_uuid);
        if (!companyData) {
            const err = new Error(i18n_1.default.__('company.no_company_exist'));
            err.statusCode = 400;
            throw err;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : get all members of the same company
* 🗓 Created : 21/11/2023
*/
const getAllMembers = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield user_repo_1.default.getAllmembersList(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the members data
            //
            container.output.result = yield user_repo_1.default.getAllmembersList(container, 'membersData');
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = membersListService;
//# sourceMappingURL=membersList.service.js.map