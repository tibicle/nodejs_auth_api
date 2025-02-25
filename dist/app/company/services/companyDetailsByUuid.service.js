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
// Import Static
// Import Middleware
// Import Controllers
// Import Helpers
// Import Transformers
// Import Libraries
// Import Repos
const company_repos_1 = __importDefault(require("../repos/company.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  company details by uuid Services
* 🗓 Created : 15/11/2023
*/
const companyDetailsByUuidService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params }, derived: { password } } = container;
        const company_details = [];
        for (let i = 0; i < query.company.length; i++) {
            //
            //  get company details by company uuid
            //
            const company = yield company_repos_1.default.getCompanyDetailsByUuid(query.company[i]);
            company_details.push(company);
        }
        container.output.result = company_details;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = companyDetailsByUuidService;
//# sourceMappingURL=companyDetailsByUuid.service.js.map