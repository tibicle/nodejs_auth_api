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
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const company_repos_1 = __importDefault(require("../repos/company.repos"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : create company profile
* 🗓 Created : 05/09/2024
*/
const createCompanyProfileService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //  validate company uuid is valid
        //
        yield company_repos_1.default.checkCompanyExists(body.company_uuid);
        //
        //  store company profile data 
        //
        yield storeProfileDetails(container);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('company.profile_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : store company profile in database
* 🗓 Created : 05/09/2024
*/
const storeProfileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  validate each company has only one profile data 
        //
        const companyProfileData = yield company_repos_1.default.getCompanyProfileByCompanyUuid(body.company_uuid);
        if (companyProfileData) {
            const err = new Error(i18n_1.default.__('company.profile_already_exist'));
            err.statusCode = 400;
            throw err;
        }
        if (body.file_uuid) {
            //
            // validate file uuid is valid or not
            //
            const fileDetail = yield file_repo_1.default.getFileByUuid(body.file_uuid);
            if (!fileDetail) {
                const err = new Error(i18n_1.default.__('no_file_found'));
                err.statusCode = 400;
                throw err;
            }
        }
        //
        //  company profile model
        //
        const companyProfileModel = {
            company_uuid: body.company_uuid,
            company_profile_bio: body.company_profile_bio,
            website_url: body.website_url,
            mission: body.mission,
            activity: body.activity,
            objective: body.objective,
            preference: body.preference,
            file_uuid: body.file_uuid,
            created_by: logged_in_user.uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        yield company_repos_1.default.insertCompanyProfile(companyProfileModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createCompanyProfileService;
//# sourceMappingURL=createCompanyProfile.service.js.map