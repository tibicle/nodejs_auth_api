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
// Import Config
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
class CompanyRepo {
    /*
    * 😎 @author : Sushant Shekhar
    * 🚩 @uses :  check the company details in database
    * 🗓 Created : 18/10/2023
    */
    getCompanyData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companyDetails] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()]);
                return companyDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get company with their email
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userDetail] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .whereRaw('LOWER(email) = LOWER(?)', [email]);
                return userDetail;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check email is exist with the same company or not by user uuid in user_company
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkEmailWithCompany(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, query }, derived: { password, user, companyData } } = container;
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('user_uuid', user.uuid)
                    .andWhere('company_uuid', companyData.uuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get company details by user uuid
   🗓 @created : 1/11/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanyByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as r`)
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as ur`, "r.uuid", "ur.company_uuid")
                    .select('r.name')
                    .where('ur.user_uuid', userUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get company details by company uuid
    🗓 @created : 1/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyDetailsByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companyData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, "c.uuid", "uc.company_uuid")
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`, "uc.user_uuid", "ur.user_uuid")
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as r`, "ur.role_uuid", "r.uuid")
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE} as cp`, "cp.company_uuid", "c.uuid")
                    .select('c.uuid', 'c.name', 'c.address', 'c.email', 'c.status', 'c.gstin as vat_id', 'r.name as role', 'c.created_at', 'c.updated_at', 'cp.company_profile_bio', 'cp.website_url', 'cp.mission', 'cp.activity', 'cp.objective', 'cp.preference', 'cp.created_at as profile_created_at', 'cp.updated_at as profile_updated_at')
                    .where('c.uuid', uuid);
                if (!companyData) {
                    const err = new Error(i18n_1.default.__('company.no_company_exist'));
                    err.statusCode = 400;
                    throw err;
                }
                return companyData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check vat id already exist or not
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkVatId(vatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .where('gstin', vatId);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get user id by company uuid
    🗓 @created : 24/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserIdByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('company_uuid', companyUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update company details
    🗓 @created : 16/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateCompanyDetails(uuid, companyModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .where('uuid', uuid)
                    .update(companyModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get company uuid by user uuid
    🗓 @created : 16/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as ur`)
                    .where('ur.user_uuid', userUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check company exists or not
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkCompanyExists(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .where('uuid', uuid);
                if (!company) {
                    const err = new Error(i18n_1.default.__('company.no_company_exist'));
                    err.statusCode = 400;
                    throw err;
                }
                return company;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert in company profile
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertCompanyProfile(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [saveCompanyProfile] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE}`)
                    .insert(dataModel)
                    .returning('uuid');
                return saveCompanyProfile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert in company profile
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateCompanyProfile(uuid, dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE}`)
                    .update(dataModel)
                    .where('uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get company details by user uuid
   🗓 @created : 05/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanyProfileByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE}`)
                    .select('uuid')
                    .where('company_uuid', companyUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get company details by user uuid
    🗓 @created : 4/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyDetailsByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as r`)
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as ur`, "r.uuid", "ur.company_uuid")
                    .select('r.name', 'r.uuid', 'r.status', 'r.created_by')
                    .where('ur.user_uuid', userUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check user is company owner or not
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkOwnerOfCompany(userUuid, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', companyUuid);
                return company;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : check user is in same company
   🗓 @created : 23/01/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    checkUserIsInCompany(userUuid, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', companyUuid);
                return company;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get company details by user uuid
   🗓 @created : 1/11/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserRoleByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as r`)
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as ur`, "r.uuid", "ur.company_uuid")
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as urr`, "urr.user_uuid", "ur.user_uuid")
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as rr`, "rr.uuid", "urr.role_uuid")
                    .select('rr.name')
                    .where('r.uuid', companyUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get company details
    * 🗓 Created : 03/10/2024
    */
    getCompanyByCompanyUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .select('uuid', 'name')
                    .where('uuid', uuid);
                if (!company) {
                    const err = new Error(i18n_1.default.__('company.no_company_exist'));
                    err.statusCode = 400;
                    throw err;
                }
                return company;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
* 😎 @author : Ekta Patel
* 🚩 @uses : get company profile
* 🗓 Created : 03/10/2024
*/
    getDetailsForCompanyMessage(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companyMessage] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE}`)
                    .where('company_uuid', uuid);
                if (!companyMessage) {
                    const err = new Error(i18n_1.default.__('company.profile_data_missing'));
                    err.statusCode = 400;
                    throw err;
                }
                return companyMessage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check  user and company already exist or not
    🗓 @created : 04/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkUserCompany(userUuid, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', companyUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : delete user in company
   🗓 @created : 06/11/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    deleteUserFromCompany(userUuid, companyUuid, teamOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .del()
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', companyUuid)
                    .andWhereNot('user_uuid', teamOwner);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new CompanyRepo();
//# sourceMappingURL=company.repos.js.map