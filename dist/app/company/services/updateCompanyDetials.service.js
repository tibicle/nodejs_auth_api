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
// Import Static
// Import Middleware
// Import Controllers
// Import Helpers
// Import Transformers
// Import Libraries
// Import Repos
const company_repos_1 = __importDefault(require("../repos/company.repos"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  update company details API
* 🗓 Created : 16/11/2023
*/
const updateCompanyDetailsService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        //
        //  validate company exist or not 
        //
        yield company_repos_1.default.getCompanyDetailsByUuid(params.uuid);
        //
        //  validate name of the company 
        //
        yield validateName(container);
        //
        //  validate company name and vat_id already exist or not
        //
        yield validateVatId(container);
        //
        //  update company details
        //
        yield updateCompanyDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  check company already exist or not
* 🗓 Created : 16/11/2023
*/
const validateName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        //
        //  get company details by uuid
        //
        const companyName = yield company_repos_1.default.getCompanyData(body.company_name);
        if (companyName) {
            if (companyName.uuid != params.uuid) {
                //
                //  if same company name found then throw error
                //
                const err = new Error(i18n_1.default.__("company.name_already_exist"));
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
* 😎 @author : Sushant Shekhar
* 🚩 @uses :  check vat id already exist or not
* 🗓 Created : 16/11/2023
*/
const validateVatId = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        //
        //  validate vat id already exist or not 
        //
        const vatIdData = yield company_repos_1.default.checkVatId(body.vat_id);
        //
        //  check logged in user is the owner of the company or not
        //
        const validCompanyOwner = yield company_repos_1.default.checkOwnerOfCompany(logged_in_user.uuid, params.uuid);
        if (vatIdData && !validCompanyOwner) {
            if (vatIdData.uuid != params.uuid) {
                //
                //  if same vat id found then throw error
                //
                const err = new Error(i18n_1.default.__("company.vat_id_already_exist"));
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
  * 😎 @author : Sushant Shekhar
  * 🚩 @uses :  store updated company detials in company database
  * 🗓 Created : 16/11/2023
  */
const updateCompanyDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        let companyProfileNew;
        //
        //  update company details model
        //
        const companyModel = {
            name: body.company_name,
            gstin: body.vat_id,
            address: body.company_address,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_by: logged_in_user.uuid
        };
        //
        //  store updated company detials in database
        //
        yield company_repos_1.default.updateCompanyDetails(params.uuid, companyModel);
        if (body.company_profile_bio || body.website_url || body.mission || body.activity || body.objective || body.preference || body.file_uuid) {
            //
            // get company profile data
            //
            const companyProfile = yield company_repos_1.default.getCompanyProfileByCompanyUuid(params.uuid);
            if (!companyProfile) {
                //
                //  company profile model
                //
                const companyProfileModel = {
                    company_uuid: params.uuid,
                    created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
                };
                companyProfileNew = yield company_repos_1.default.insertCompanyProfile(companyProfileModel);
            }
            else {
                companyProfileNew = companyProfile;
            }
            let companyLogo = [];
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
                company_uuid: params.uuid,
                company_profile_bio: body.company_profile_bio,
                website_url: body.website_url,
                mission: body.mission,
                activity: body.activity,
                objective: body.objective,
                preference: body.preference,
                file_uuid: body.file_uuid,
                updated_by: logged_in_user.uuid,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield company_repos_1.default.updateCompanyProfile(companyProfileNew.uuid, companyProfileModel);
        }
        container.output.message = i18n_1.default.__('company.company_detials_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateCompanyDetailsService;
//# sourceMappingURL=updateCompanyDetials.service.js.map