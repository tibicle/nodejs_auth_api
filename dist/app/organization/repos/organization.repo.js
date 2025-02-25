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
class OrganizationRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list organization details with total count
    🗓 @created : 22/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getOrganizationData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let organizationQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`)
                    .select('c.uuid', 'c.name', 'c.status', 'c.created_at')
                    .count('uc.user_uuid as total_user')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'uc.company_uuid', 'c.uuid')
                    .groupBy('c.uuid');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listOrganizationFilters(container, organizationQuery);
                    let results = yield organizationQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'organizationData') {
                    organizationQuery
                        .select('c.uuid', 'c.name', 'c.status', 'c.created_at')
                        .count('uc.user_uuid as total_user');
                    //
                    //  search filter 
                    //
                    this.listOrganizationFilters(container, organizationQuery);
                    if (query.per_page &&
                        query.page) {
                        organizationQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        organizationQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield organizationQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : filter for organization list
    🗓 @created : 05/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listOrganizationFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('c.status', `${query.status}`);
                }
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.whereRaw(`LOWER(c.name) LIKE '%${query.name.toLowerCase()}%'`);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check organization exists or not
    🗓 @created : 05/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkOrganizationByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [organization] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .where('uuid', uuid);
                if (!organization) {
                    const err = new Error(i18n_1.default.__('organization.no_organization_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return organization;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get organization details with user details into that particular organization
    🗓 @created : 05/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getOrganizationDetailsByUuid(organizationUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [organizationDetails] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'uc.company_uuid', 'c.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'c.created_by')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`, 'p.company_uuid', 'c.uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`, 'l.company_uuid', 'c.uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`, 'pe.production_uuid', 'p.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE} as cp`, 'cp.company_uuid', 'c.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'cp.file_uuid', 'f.uuid')
                    .select('c.uuid', 'c.name', 'c.address', 'u.email', 'u.mobile_no', 'c.gstin', 'c.created_at', database_1.default.raw(`json_build_object(
                            'users', CAST(COUNT(DISTINCT uc.uuid) AS INTEGER),
                            'production',CAST(COUNT(DISTINCT p.uuid) AS INTEGER),
                            'library',CAST(COUNT(DISTINCT l.uuid) AS INTEGER),
                            'exported_videos', CAST(COUNT(DISTINCT pe.uuid) AS INTEGER)
                        ) AS statistics`))
                    .select('cp.company_profile_bio', 'cp.website_url', 'cp.mission', 'cp.activity', 'cp.objective', 'cp.preference', 'cp.created_at as profile_created_at', 'cp.updated_at as profile_updated_at', database_1.default.raw(`
                                  json_build_object(
                                    'file_uuid', f.uuid,
                                     'file_url', 
                                    CASE 
                                    WHEN f.name IS NOT NULL 
                                    THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/company_profile_image', f.name)) 
                                    ELSE NULL 
                                    END
                                  )
                               as logo`))
                    .where('c.uuid', organizationUuid)
                    .groupBy('c.uuid', 'cp.company_profile_bio', 'cp.website_url', 'cp.mission', 'cp.activity', 'cp.objective', 'cp.preference', 'cp.created_at', 'cp.updated_at', 'f.uuid', 'u.email', 'u.mobile_no');
                return organizationDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update organization details
    🗓 @created : 11/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateOrganizationDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyDetails = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .update(updateDataModel)
                    .where('uuid', uuid);
                return companyDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all organization
    🗓 @created : 01/04/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getOrganizations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizationDetails = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .select('uuid', 'name', 'created_at');
                return organizationDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new OrganizationRepo();
//# sourceMappingURL=organization.repo.js.map