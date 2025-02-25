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
class LibraryRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get total library data
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTotalLibraryData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                const totalLibraryData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`)
                    .count('* as total_results')
                    .where('l.user_uuid', logged_in_user.uuid);
                if (query.type == constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST) {
                    const filterLibraryData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                        .select('pm.library_uuid')
                        .where('pm.library_uuid', database_1.default.ref('l.uuid'))
                        .andWhere('pm.production_uuid', query.production_uuid);
                    totalLibraryData.whereNotIn('l.uuid', filterLibraryData);
                }
                const [results] = yield totalLibraryData;
                if (results) {
                    return parseInt(results.total_results);
                }
                else {
                    return 0;
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
    🚩 @uses : get library data
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLibraryData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                const libraryData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`)
                    .select('l.uuid', 'l.file_uuid', 'f.name', 'f.type', 'f.length as video_length', 'f.quality', 'f.size', 'f.thumbnail_file_name', 'f.created_at')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                    .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN f.audio_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.audio_name)) ELSE NULL END as audio_url`))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'l.file_uuid')
                    .where('l.user_uuid', logged_in_user.uuid)
                    .groupBy('f.uuid', 'l.uuid');
                if (query.type == constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST) {
                    const filterLibraryData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                        .select('pm.library_uuid')
                        .where('pm.library_uuid', database_1.default.ref('l.uuid'))
                        .andWhere('pm.production_uuid', query.production_uuid);
                    libraryData.whereNotIn('l.uuid', filterLibraryData);
                }
                if (query.per_page &&
                    query.page) {
                    libraryData.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    libraryData.offset((query.page - 1) * query.per_page);
                }
                return yield libraryData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check file by uuid
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFileByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [library] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('uuid', uuid);
                if (!library) {
                    const err = new Error(i18n_1.default.__('library.no_library_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete library file
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteLibraryFile(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('uuid', uuid)
                    .del();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check library
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkLibrary(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const library = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .whereIn('uuid', uuid);
                if (library.length != uuid.length) {
                    const err = new Error(i18n_1.default.__('library.no_library_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant shekhar
    🚩 @uses : return all data with total count
    🗓 @created : 26/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllLibraryData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let libraryQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`)
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'l.file_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE} as lf`, 'lf.file_uuid', 'f.uuid')
                    .leftJoin((0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                    .select('pm.library_uuid')
                    .count('pm.library_uuid as production_count')
                    .groupBy('pm.library_uuid')
                    .as('pm_counts'), 'pm_counts.library_uuid', 'l.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG} as t`, function () {
                    this.on(database_1.default.raw('?? = any(??)', ['t.uuid', 'l.tag_uuid']));
                });
                // else{
                //     libraryQuery.where('l.user_uuid',logged_in_user.uuid);
                // }
                if (query.type == constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST) {
                    const filterLibraryData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                        .select('pm.library_uuid')
                        .where('pm.library_uuid', database_1.default.ref('l.uuid'))
                        // .andWhere('pm.library_uuid',knex.ref('lf.file_uuid'))
                        .andWhere('pm.production_uuid', query.production_uuid);
                    libraryQuery.whereNotIn('l.uuid', filterLibraryData);
                }
                if (query.type === constant_1.default.LIBRARY_LISTING_TYPE.PRODCUTION_MEDIA_LIST) {
                    libraryQuery.whereNot('f.status', 'PROCESSING');
                }
                if (str == 'CountTotalData') {
                    libraryQuery
                        .count('* as total_results');
                    //
                    //get total count after search filter
                    //
                    this.searchFilter(container, libraryQuery);
                    let [results] = yield libraryQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'libraryData') {
                    libraryQuery
                        .select('l.uuid', 'l.user_uuid', 'l.file_uuid', database_1.default.raw('COALESCE(l.name, f.name) as name'), 'f.type', 'f.length as video_length', 'f.quality', 'f.size', 'f.thumbnail_file_name', 'l.created_at', 'f.name as file_name', 'f.status', 'lf.uuid as low_res_file_uuid', 'lf.name as low_res_file_name', database_1.default.raw('CAST(pm_counts.production_count AS INTEGER) AS production_count'))
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                        .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                        .select(database_1.default.raw(`CASE WHEN f.audio_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.audio_name)) ELSE NULL END as audio_url`))
                        .select(database_1.default.raw(`CASE WHEN EXISTS (SELECT 1 FROM ${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG} WHERE uuid = ANY(l.tag_uuid)) 
                    THEN array_agg(DISTINCT t.name) 
                    ELSE NULL 
                    END AS tags`))
                        .groupBy('l.uuid', 'l.user_uuid', 'f.uuid', 'pm_counts.production_count', 'lf.uuid', 'lf.name');
                    //
                    //search filter 
                    //
                    this.searchFilter(container, libraryQuery);
                    if (query.per_page &&
                        query.page) {
                        libraryQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        libraryQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield libraryQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : return filtered data if anyone search
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    searchFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    const name = `%${query.name.toLowerCase()}%`;
                    searchQuery.whereRaw(`LOWER("l"."name") LIKE ?`, [name]);
                }
                //
                //  filter by type
                //
                if (query.file_type) {
                    searchQuery.andWhere('f.type', `${query.file_type}`);
                }
                //
                //  filter by company uuid
                //
                if (query.company_uuid) {
                    searchQuery.andWhere('company_uuid', `${query.company_uuid}`);
                }
                else {
                    searchQuery.andWhere('company_uuid', null);
                }
                // 
                // filter data from date till today
                // 
                if (query.from) {
                    searchQuery.where('l.created_at', ">=", `${query.from}`);
                }
                // 
                // filter data till given date 
                // 
                if (query.to) {
                    searchQuery.where('l.created_at', "<=", `${query.to}`);
                }
                //
                // filter data by tag name
                //
                if (query.tag_name) {
                    searchQuery.whereRaw(`LOWER(t.name) LIKE '%${query.tag_name.toLowerCase()}%'`);
                }
                if (query.user_uuid) {
                    // searchQuery.andWhere('company_uuid',null)
                    searchQuery.where('l.user_uuid', query.user_uuid);
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : get library details
    🗓 @created : 27/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLibraryDetails(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [libraryDetails] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`)
                    .join(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'l.file_uuid', 'f.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE} as lf`, 'lf.file_uuid', 'f.uuid')
                    .select('l.uuid', 'f.uuid as file_uuid', 'l.name', 'l.description', 'f.type', 'f.quality', 'f.size', 'f.content_type', 'f.length', 'l.updated_at', 'l.tag_uuid', 'f.name as file_name', 'lf.name as low_res_name')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                    .where('l.uuid', uuid);
                return libraryDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update video details
    🗓 @created : 27/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateLibraryDetails(uuid, updateLibraryModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateFile = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`)
                    .where('l.uuid', uuid)
                    .update(updateLibraryModel);
                return updateFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check library by uuid
    🗓 @created : 2/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateLibrary(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [library] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('uuid', uuid);
                if (!library) {
                    const err = new Error(i18n_1.default.__('library.library_not_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Bhavya Nayak
   🚩 @uses : get library by uuid
   🗓 @created : 03/10/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getLibraryByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [library] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('uuid', uuid)
                    .select('uuid', 'company_uuid', 'user_uuid', 'file_uuid', 'name', 'description', 'created_at', 'created_by', 'updated_at', 'updated_by');
                if (!library) {
                    const err = new Error(i18n_1.default.__('library.library_not_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get tag by uuid
    🗓 @created : 31/10/2023
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : check name
    🗓 @created : 3/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateName(name, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [nameData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as r`)
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as ur`, "r.user_uuid", "ur.user_uuid")
                    .whereRaw("LOWER(r.name) = LOWER(?)", [name.trim()])
                    .andWhere("ur.user_uuid", uuid);
                return nameData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check tag
    🗓 @created : 3/11/2023
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert new tag
    🗓 @created : 3/10/2023
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
    🚩 @uses : validate self library upload file name
    🗓 @created : 18/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateLibraryNameForSelf(name, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [nameData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere('company_uuid', null)
                    .andWhere("user_uuid", userUuid);
                return nameData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate library file name in company
    🗓 @created : 19/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateLibraryNameForCompany(name, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere("company_uuid", companyUuid);
                return validateName;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : validate library file name
    🗓 @created : 19/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateLibraryName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()]);
                return validateName;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update library details by file uuid
    🗓 @created : 04/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateLibraryDetailsByFileUuid(fileUuid, updateLibraryModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateFile = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('file_uuid', fileUuid)
                    .update(updateLibraryModel);
                return updateFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all library by user uuid
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLibraryByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const libraryUuid = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .select('uuid')
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', null);
                const libraryUuids = libraryUuid.map(item => item.uuid);
                return libraryUuids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user library usage
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserLibraryUsage(libraryUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [usage] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .sum('s3_usage as total_usage')
                    .whereIn('uuid', libraryUuid);
                return usage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all library by company uuid
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllLibraryByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const libraryUuid = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .select('uuid')
                    // .where('user_uuid',userUuid)
                    .where('company_uuid', companyUuid);
                const libraryUuids = libraryUuid.map(item => item.uuid);
                return libraryUuids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get library by file uuid
    🗓 @created : 25/10/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLibraryByFileUuid(fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [library] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .where('file_uuid', fileUuid)
                    .select('uuid', 'company_uuid', 'user_uuid', 'file_uuid', 'name', 'description', 'created_at', 'created_by', 'updated_at', 'updated_by');
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new LibraryRepo();
//# sourceMappingURL=library.repo.js.map