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
const company_repos_1 = __importDefault(require("../repos/company.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  company verify Services
* 🗓 Created : 17/10/2023
*/
const companyVerifyServices = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query }, derived: { password } } = container;
        //
        //validate company and user exist or not
        //
        yield checkCompanyAndEmail(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  validate company by its organization name
* 🗓 Created : 17/10/2023
*/
const checkCompanyAndEmail = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query }, derived: { password } } = container;
        //
        //validate company by organization name in database
        //
        const verifyCompanyData = yield company_repos_1.default.getCompanyData(query.organization_name);
        container.derived.companyData = verifyCompanyData;
        if (verifyCompanyData) {
            //
            //get user data by email
            //
            container.derived.user = yield company_repos_1.default.getUserByEmail(query.email);
            if (container.derived.user) {
                //
                //check that same user with same company exit or not
                //
                const emailWithCompanyExist = yield company_repos_1.default.checkEmailWithCompany(container);
                if (emailWithCompanyExist) {
                    const err = new Error(i18n_1.default.__("user.email_with_same_company_exist"));
                    err.statusCode = 400;
                    throw err;
                }
                else {
                    container.output.message = i18n_1.default.__('company_exist');
                }
            }
            else {
                container.output.message = i18n_1.default.__('company_exist');
            }
        }
        else {
            container.output.message = i18n_1.default.__('company_not_exist');
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = companyVerifyServices;
//# sourceMappingURL=company.verify.services.js.map