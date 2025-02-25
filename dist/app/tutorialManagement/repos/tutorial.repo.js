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
class TutorialRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save tutorial data
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTutorialData(tutorialDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tutorialData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT}`)
                    .insert(tutorialDataModel)
                    .returning('uuid');
                return tutorialData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update tutorial data
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTutorialDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorialDetails = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT}`)
                    .update(updateDataModel)
                    .where('uuid', uuid);
                return tutorialDetails;
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
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT}`)
                    .where('title', title.toLowerCase())
                    .andWhere('type', 'TUTORIAL');
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
    🚩 @uses : check tutorial by uuid
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkTutorialByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tutorial] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT}`)
                    .where('uuid', uuid)
                    .andWhere('type', 'TUTORIAL');
                if (!tutorial) {
                    const err = new Error(i18n_1.default.__('tutorial.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return tutorial;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all tutorial details with total count
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllTutorialData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let tutorialQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT} as tsm`)
                    .select('tsm.uuid', 'tsm.title', 'tsm.created_at', 'tsm.updated_at', 'tsm.status', 'tsm.access_type')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'tsm.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'tsm.cover_uuid')
                    .where('tsm.type', 'TUTORIAL');
                if (logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER)) {
                    tutorialQuery.where('tsm.created_by', logged_in_user.uuid);
                }
                if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN) || logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER))) {
                    const err = new Error(i18n_1.default.__('tutorial.list_tutorial'));
                    err.statusCode = 400;
                    throw err;
                }
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listTutorialFilters(container, tutorialQuery);
                    let results = yield tutorialQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'tutorialData') {
                    tutorialQuery
                        .select('tsm.uuid', 'tsm.title', 'tsm.created_at', 'tsm.updated_at', 'tsm.status', 'tsm.access_type')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                        .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', ft.name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', fc.name)) ELSE NULL END as cover_url`));
                    //
                    //  search filter 
                    //
                    this.listTutorialFilters(container, tutorialQuery);
                    if (query.per_page &&
                        query.page) {
                        tutorialQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        tutorialQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield tutorialQuery;
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
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listTutorialFilters(container, searchQuery) {
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
                //
                //  filter by access type
                //
                if (query.access_type) {
                    searchQuery.andWhere('tsm.access_type', `${query.access_type}`);
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
    🚩 @uses : validate tag
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tagData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG}`)
                    .where('name', tag.toLowerCase());
                return tagData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save new tag
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveNewTag(tagModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG}`)
                    .insert(tagModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get tutorial details by uuid
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTutorialByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tutorial] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT} as tsm`)
                    .select('tsm.*')
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'tsm.cover_uuid')
                    .where('tsm.uuid', uuid)
                    .andWhere('tsm.type', 'TUTORIAL');
                if (!tutorial) {
                    const err = new Error(i18n_1.default.__('tutorial.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return tutorial;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get tag name by uuid
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTagNameByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tagData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG} as t`)
                    .where("t.uuid", uuid)
                    .select('t.uuid', 't.name');
                return tagData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get relate articles name
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getRelatedArticle(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [relatedArticle] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.TUTORIAL_STATIC_MANAGEMENT} as tsm`)
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as thumbnail_url`))
                    .select('tsm.uuid', 'tsm.title', 'tsm.description')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'tsm.thumbnail_uuid')
                    .where('tsm.uuid', uuid);
                return relatedArticle;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new TutorialRepo();
//# sourceMappingURL=tutorial.repo.js.map