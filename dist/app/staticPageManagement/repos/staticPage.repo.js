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
class StaticPageRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save static page data
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveStaticPageData(staticPageDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staticPageData = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.STATIC_PAGE}`)
                    .insert(staticPageDataModel)
                    .returning('uuid');
                return staticPageData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update static page data
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStaticPageDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staticPageDetails = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.STATIC_PAGE}`)
                    .update(updateDataModel)
                    .where('uuid', uuid);
                return staticPageDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check title exists or not
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.STATIC_PAGE}`)
                    .where('title', title.toLowerCase());
                return checkTitle;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check static page by uuid
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkStaticPageByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [staticPage] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.STATIC_PAGE}`)
                    .where('uuid', uuid);
                if (!staticPage) {
                    const err = new Error(i18n_1.default.__('staticPage.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return staticPage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all static page details with total count
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllStaticPageData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let staticPageQuery = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.STATIC_PAGE} as tsm`)
                    .select('tsm.uuid', 'tsm.title', 'tsm.created_at', 'tsm.updated_at', 'tsm.status')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'tsm.updated_by');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listStaticPageFilters(container, staticPageQuery);
                    let results = yield staticPageQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'staticPageData') {
                    staticPageQuery
                        .select('tsm.uuid', 'tsm.title', 'tsm.created_at', 'tsm.updated_at', 'tsm.status')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"));
                    //
                    //  search filter 
                    //
                    this.listStaticPageFilters(container, staticPageQuery);
                    if (query.per_page &&
                        query.page) {
                        staticPageQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        staticPageQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield staticPageQuery;
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
    🚩 @uses : list tutorial filter
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listStaticPageFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by created by
                //
                if (query.created_by) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.created_by.toLowerCase()}%'`);
                }
                //
                //  filter by modified by
                //
                if (query.modified_by) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"us"."first_name","us"."last_name")) LIKE '%${query.modified_by.toLowerCase()}%'`);
                }
                //
                //  filter by title
                //
                if (query.title) {
                    searchQuery.whereRaw(`LOWER(tsm.title) LIKE '%${query.title.toLowerCase()}%'`);
                }
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('tsm.status', `${query.status}`);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new StaticPageRepo();
//# sourceMappingURL=staticPage.repo.js.map