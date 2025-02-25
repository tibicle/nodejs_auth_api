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
class AcademyRepo {
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
                const [tutorialData] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL}`)
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
                const tutorialDetails = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL}`)
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
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL}`)
                    .whereRaw('LOWER(title) = LOWER(?)', [title]);
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
                const [tutorial] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL}`)
                    .where('uuid', uuid);
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
                let tutorialQuery = (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL} as tsm`)
                    .select('tsm.uuid', 'tsm.title', 'tsm.created_at', 'tsm.updated_at', 'tsm.status', 'tsm.access_type')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'tsm.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'tsm.cover_uuid');
                if (logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER)) {
                    tutorialQuery.where('tsm.created_by', logged_in_user.uuid);
                }
                // if(!(logged_in_user.roles.includes(config.system_roles.SUPER_ADMIN) || logged_in_user.roles.includes(config.system_roles.VF_ADMIN_CONTENT_MANAGER))){
                //     const err:any = new Error(i18n.__('tutorial.list_tutorial'));
                //         err.statusCode = 400;
                //         throw err;
                // }
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
                        .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`));
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
                const [tutorial] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL} as tsm`)
                    .select('tsm.*')
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'tsm.cover_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .where('tsm.uuid', uuid);
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
                const [relatedArticle] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL} as tsm`)
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', f.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select('tsm.uuid', 'tsm.title', 'tsm.description', 'tsm.access_type', 'tsm.created_at')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .where('tsm.uuid', uuid);
                return relatedArticle;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check module title
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkModuleTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE}`)
                    .whereRaw('LOWER(title) = LOWER(?)', [title]);
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
    🚩 @uses : check module by uuid
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkModuleByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [module] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE}`)
                    .where('uuid', uuid);
                if (!module) {
                    const err = new Error(i18n_1.default.__('module.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return module;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save module data
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveModuleData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [moduleData] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE}`)
                    .insert(data)
                    .returning('uuid');
                return moduleData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all module details with total count
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllModuleData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let moduleQuery = (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE} as m`)
                    .select('m.uuid', 'm.description', 'm.title', 'm.created_at', 'm.updated_at', 'm.status', 'm.access_type')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'm.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'm.cover_uuid');
                if (logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_CONTENT_MANAGER)) {
                    moduleQuery.where('m.created_by', logged_in_user.uuid);
                }
                // if(!(logged_in_user.roles.includes(config.system_roles.SUPER_ADMIN) || logged_in_user.roles.includes(config.system_roles.VF_ADMIN_CONTENT_MANAGER))){
                //     const err:any = new Error(i18n.__('module.list_module'));
                //         err.statusCode = 400;
                //         throw err;
                // }
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listModuleFilters(container, moduleQuery);
                    let results = yield moduleQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'moduleData') {
                    moduleQuery
                        .select('m.uuid', 'm.description', 'm.title', 'm.created_at', 'm.updated_at', 'm.status', 'm.access_type')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                        .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`));
                    //
                    //  search filter 
                    //
                    this.listModuleFilters(container, moduleQuery);
                    if (query.per_page &&
                        query.page) {
                        moduleQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        moduleQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield moduleQuery;
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
    🚩 @uses : list module filter
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listModuleFilters(container, searchQuery) {
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
                    searchQuery.whereRaw(`LOWER(m.title) LIKE '%${query.title.toLowerCase()}%'`);
                }
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('m.status', `${query.status}`);
                }
                //
                //  filter by access type
                //
                if (query.access_type) {
                    searchQuery.andWhere('m.access_type', `${query.access_type}`);
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
    🚩 @uses : update module data
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateModuleDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const moduleDetails = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE}`)
                    .update(updateDataModel)
                    .where('uuid', uuid);
                return moduleDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get module details by uuid
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getModuleByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [module] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE} as m`)
                    .select('m.*')
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'm.cover_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'm.created_by')
                    .where('m.uuid', uuid);
                if (!module) {
                    const err = new Error(i18n_1.default.__('module.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return module;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get module related articles name
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getModuleRelatedArticle(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [relatedArticle] = yield (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL} as t`)
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', f.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select('t.uuid', 't.title', 't.description', 't.access_type', 't.created_at')
                    .leftJoin(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE} as m`, 'f.uuid', 'm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'm.created_by')
                    .where('m.uuid', uuid);
                return relatedArticle;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all user tutorial
    🗓 @created : 27/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUserTutorialData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let tutorialQuery = (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.TUTORIAL} as tsm`)
                    .select('tsm.uuid', 'tsm.title', 'tsm.description', 'tsm.created_at', 'tsm.updated_at', 'tsm.status', 'tsm.access_type')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tsm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'tsm.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'tsm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'tsm.cover_uuid');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listUserTutorialFilters(container, tutorialQuery);
                    let results = yield tutorialQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'userTutorialData') {
                    tutorialQuery
                        .select('tsm.uuid', 'tsm.title', 'tsm.description', 'tsm.created_at', 'tsm.updated_at', 'tsm.status', 'tsm.access_type')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                        .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`));
                    //
                    //  search filter 
                    //
                    this.listUserTutorialFilters(container, tutorialQuery);
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
    🚩 @uses : list user tutorial filters
    🗓 @created : 27/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserTutorialFilters(container, searchQuery) {
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
    🚩 @uses : get all user module data
    🗓 @created : 28/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUserModuleData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let moduleQuery = (0, database_1.default)(`${constant_1.default.schema.ACADEMY}.${constant_1.default.tables.MODULE} as m`)
                    .select('m.uuid', 'm.description', 'm.title', 'm.created_at', 'm.updated_at', 'm.status', 'm.access_type')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                    .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'm.created_by')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'm.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ft`, 'ft.uuid', 'm.thumbnail_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc`, 'fc.uuid', 'm.cover_uuid');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listModuleFilters(container, moduleQuery);
                    let results = yield moduleQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'userModuleData') {
                    moduleQuery
                        .select('m.uuid', 'm.description', 'm.title', 'm.created_at', 'm.updated_at', 'm.status', 'm.access_type')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as created_by"))
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(us.first_name, ''), NULLIF(us.last_name, '')), '') as modified_by"))
                        .select(database_1.default.raw(`CASE WHEN ft.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', ft.name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/academy', fc.name)) ELSE NULL END as cover_url`));
                    //
                    //  search filter 
                    //
                    this.listUserModuleFilters(container, moduleQuery);
                    if (query.per_page &&
                        query.page) {
                        moduleQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        moduleQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield moduleQuery;
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
    🚩 @uses : list user module filters
    🗓 @created : 28/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserModuleFilters(container, searchQuery) {
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
                    searchQuery.whereRaw(`LOWER(m.title) LIKE '%${query.title.toLowerCase()}%'`);
                }
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('m.status', `${query.status}`);
                }
                //
                //  filter by access type
                //
                if (query.access_type) {
                    searchQuery.andWhere('m.access_type', `${query.access_type}`);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new AcademyRepo();
//# sourceMappingURL=academy.repo.js.map