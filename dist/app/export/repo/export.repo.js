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
const moment_1 = __importDefault(require("moment"));
class ExportRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save export file details
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveExportDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .insert(data)
                    .returning('*');
                return exportData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check export file by uuid
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkExportFileByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .where('uuid', uuid);
                if (!exportFile) {
                    const err = new Error(i18n_1.default.__('export.no_export_file_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get export file by uuid
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportFileByUuid(uuid, sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'pe.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc `, 'fc.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uu`, 'uu.uuid', 'pe.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ff `, 'ff.uuid', 'uu.file_uuid')
                    .select('pe.uuid', 'pe.production_uuid', 'pe.file_uuid', 'pe.name', 'pe.status', 'pe.type', 'pe.quality', 'pe.fps', 'sequence_uuid', 'pe.embed_code', 'pe.embed_thumbnail', database_1.default.raw(`json_build_object(
                'uuid', u.uuid,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'profile_pic', CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fc.name)) ELSE NULL END
            ) as created_by`), database_1.default.raw(`
                CASE 
                  WHEN uu.updated_by IS NULL THEN NULL 
                  ELSE json_build_object(
                    'uuid', uu.uuid,
                    'first_name', uu.first_name,
                    'last_name', uu.last_name,
                    'profile_pic', CASE WHEN ff.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', ff.name)) ELSE NULL END
                  )
                END as updated_by
              `))
                    .where('pe.uuid', uuid)
                    .andWhere('pe.sequence_uuid', sequenceUuid);
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update file export status details
    🗓 @created : 01/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExportFileStatus(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exportStatus = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .update(data)
                    .where('uuid', uuid);
                return exportStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update export details
    🗓 @created : 16/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExportDetails(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exportDetails = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .update(data)
                    .where('uuid', uuid);
                return exportDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save error log status
    🗓 @created : 18/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveErrorLogStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.ERROR_LOG_STATUS}`)
                    .insert(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant shekhar
    🚩 @uses : Get all exported videos
    🗓 @created : 29/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllExportVideos(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user, params } } = container;
                let exportQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`, 'p.uuid', 'pe.production_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'pe.file_uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE} as ps`, 'ps.uuid', 'pe.sequence_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'pe.created_by')
                    .where('pe.production_uuid', params.production_uuid)
                    .andWhere('pe.is_deleted', false);
                if (str == 'CountTotalData') {
                    exportQuery
                        .count('* as total_results');
                    //
                    //get total count after search filter
                    //
                    this.searchFilter(container, exportQuery);
                    let [results] = yield exportQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'exportData') {
                    exportQuery
                        .select('p.uuid as production_uuid', 'p.name as production_name', 'p.description', 'pe.uuid', 'pe.file_uuid', 'pe.status', 'pe.end_time as completed_on', 'pe.total_time as total_minutes', database_1.default.raw('COALESCE(pe.name, f.name) as name'), 'pe.start_time as exported_on', 'pe.updated_at', 'ps.title as sequence_name', database_1.default.raw(`CONCAT_WS(' ',u.first_name,u.last_name) as exported_by`), 'f.length', 'f.size', 'f.type', 'f.thumbnail_file_name', 'ps.title as sequence_title')
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                        .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                        .groupBy('f.uuid', 'pe.uuid', 'u.uuid', 'ps.uuid', 'p.name', 'p.description', 'p.uuid', 'ps.title')
                        .orderBy('pe.created_at', 'desc');
                    //
                    //search filter 
                    //
                    this.searchFilter(container, exportQuery);
                    if (query.per_page &&
                        query.page) {
                        exportQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        exportQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield exportQuery;
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
                //  filter by file name
                //
                if (query.file_name) {
                    searchQuery.whereRaw(`(LOWER("f"."name") LIKE '%${query.name.toLowerCase()}%')`);
                }
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.where(function () {
                        this.where(function () {
                            this.whereRaw(`LOWER("pe"."name") LIKE ?`, [`%${query.name.toLowerCase()}%`]);
                        })
                            .orWhere(function () {
                            this.whereNull("pe.name")
                                .andWhereRaw(`LOWER("f"."name") LIKE ?`, [`%${query.name.toLowerCase()}%`]);
                        });
                    });
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
                    searchQuery.where('pe.created_at', ">=", `${query.from}`);
                }
                // 
                // filter data till given date 
                // 
                if (query.to) {
                    searchQuery.where('pe.created_at', "<=", `${query.to}`);
                }
                if (query.sequence_name) {
                    searchQuery.whereRaw(`(LOWER("ps"."title") LIKE '%${query.sequence_name.toLowerCase()}%')`);
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
    🚩 @uses : delete export video
    🗓 @created : 29/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteExportVideoByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
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
    🚩 @uses : get total export minutes of the user
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportTotalMinutes(productionUuid, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .sum('total_time')
                    .whereIn('production_uuid', productionUuid)
                    .where('created_by', userUuid);
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get total minutes with user usage
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportTotalMinutesWithUserUsage(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exportFile = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .select('u.uuid', 'u.first_name', 'u.last_name', 
                // knex.raw('SUM(pe.total_time) as total_time')
                database_1.default.raw('SUM(pe.total_time)::INTEGER as total_time'))
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END as profile_url`))
                    // .select(knex.raw('SUM(SUM(pe.total_time)) OVER () as total_sum'))
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'pe.created_by', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                    .whereIn('pe.production_uuid', productionUuid)
                    .groupBy('u.uuid', 'u.first_name', 'u.last_name', 'f.name');
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get export video details
    🗓 @created : 10/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportVideoDetailsByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .select('p.uuid as production_uuid', 'p.name as production_name', 'p.description as production_description', 'pe.uuid', 'pe.file_uuid', 'pe.embed_code', 'pe.embed_thumbnail', 'pe.hls_status', database_1.default.raw('COALESCE(pe.name, f.name) as name'), 'f.name as file_name', 'pe.created_at as exported_on', 'pe.updated_at', 'ps.title as sequence_name', 'pe.sequence_uuid', database_1.default.raw(`json_build_object(
                            'uuid', u.uuid,
                            'first_name', u.first_name,
                            'last_name', u.last_name,
                            'profile_pic', CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fc.name)) ELSE NULL END
                        ) as created_by`), database_1.default.raw(`
                            CASE 
                              WHEN uu.updated_by IS NULL THEN NULL 
                              ELSE json_build_object(
                                'uuid', uu.uuid,
                                'first_name', uu.first_name,
                                'last_name', uu.last_name,
                                'profile_pic', CASE WHEN ff.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', ff.name)) ELSE NULL END
                              )
                            END as updated_by
                          `), 'f.length', 'f.size', 'f.type', 'f.thumbnail_file_name', 'pe.seo_title', 'pe.description as export_description', 'p.user_uuid as production_user', 'p.company_uuid as production_company')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                    .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`, 'p.uuid', 'pe.production_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'pe.file_uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE} as ps`, 'ps.uuid', 'pe.sequence_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'pe.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc `, 'fc.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uu`, 'uu.uuid', 'pe.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ff `, 'ff.uuid', 'uu.file_uuid')
                    .where('pe.uuid', uuid);
                // .andWhere('pe.status','=',config.file_status.COMPLETED)
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get export video by sequence uuid
    🗓 @created : 11/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportVideoDetailsBySequenceUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFileData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .where('sequence_uuid', uuid);
                return exportFileData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant shekhar
    🚩 @uses : get total export minutes of the user
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportTotalMinutesDate(productionUuid, userUuid, startData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthStart = (0, moment_1.default)(startData).format('YYYY-MM-DD');
                const monthEnd = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                //   console.log(monthStart,monthEnd)
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .sum('total_time')
                    .whereIn('production_uuid', productionUuid)
                    .where('created_by', userUuid)
                    .whereBetween('created_at', [monthStart, monthEnd]);
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant shekhar
🚩 @uses : get total export minutes of the user
🗓 @created : 22/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
    getExportTotalMinutesWithUserUsageDetail(productionUuid, startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthStart = (0, moment_1.default)(startDate).format('YYYY-MM-DD');
                const monthEnd = (0, moment_1.default)().endOf('month').format('YYYY-MM-DD');
                const exportFile = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .select('u.uuid', 'u.first_name', 'u.last_name', 
                // knex.raw('SUM(pe.total_time) as total_time')
                database_1.default.raw('SUM(pe.total_time)::INTEGER as total_time'))
                    // .select(knex.raw('SUM(SUM(pe.total_time)) OVER () as total_sum'))
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'pe.created_by', 'u.uuid')
                    .whereIn('pe.production_uuid', productionUuid)
                    .whereBetween('pe.created_at', [monthStart, monthEnd])
                    .groupBy('u.uuid', 'u.first_name', 'u.last_name');
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant shekhar
   🚩 @uses : validate export production name
   🗓 @created : 15/11/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    validateExportName(name, productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere('production_uuid', productionUuid);
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
    🚩 @uses : check export file by embed code
    🗓 @created : 25/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportDetailsByEmbedCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .where('embed_code', code);
                if (!exportFile) {
                    const err = new Error(i18n_1.default.__('export.no_export_file_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get export video details
   🗓 @created : 25/11/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getExportVideoDetailsByEmbedCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .select('p.uuid as production_uuid', 'p.name as production_name', 'p.description as production_description', 'pe.uuid', 'pe.file_uuid', database_1.default.raw('COALESCE(pe.name, f.name) as name'), 'f.name as file_name', 'pe.created_at as exported_on', 'pe.updated_at', 'ps.title as sequence_name', 'p.user_uuid as production_user', 'p.company_uuid as production_company', database_1.default.raw(`json_build_object(
                            'uuid', u.uuid,
                            'first_name', u.first_name,
                            'last_name', u.last_name,
                            'profile_pic', CASE WHEN fc.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fc.name)) ELSE NULL END
                        ) as created_by`), database_1.default.raw(`
                            CASE 
                              WHEN uu.updated_by IS NULL THEN NULL 
                              ELSE json_build_object(
                                'uuid', uu.uuid,
                                'first_name', uu.first_name,
                                'last_name', uu.last_name,
                                'profile_pic', CASE WHEN ff.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', ff.name)) ELSE NULL END
                              )
                            END as updated_by
                          `), 'f.length', 'f.size', 'f.type', 'f.thumbnail_file_name', 'pe.seo_title', 'pe.description as export_description', 'pe.embed_hls_file_name')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                    .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`, 'p.uuid', 'pe.production_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'pe.file_uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE} as ps`, 'ps.uuid', 'pe.sequence_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'pe.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fc `, 'fc.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uu`, 'uu.uuid', 'pe.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ff `, 'ff.uuid', 'uu.file_uuid')
                    .where('pe.embed_code', code);
                // .andWhere('pe.status','=',config.file_status.COMPLETED)
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check embed code
    🗓 @created : 27/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkEmbedCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [embedCode] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .whereRaw("LOWER(embed_code) = LOWER(?)", [code.trim()]);
                return embedCode;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check job id exist
    🗓 @created : 28/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [id] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .where('hls_jobid', jobId);
                return id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update export details
    🗓 @created : 28/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExportDetailsByExportUuid(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exportDetails = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .update(data)
                    .where('uuid', uuid);
                return exportDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update export details by job id
    🗓 @created : 28/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExportDetailsByJobId(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exportDetails = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .update(data)
                    .where('hls_jobid', uuid);
                return exportDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get export file by uuid
    🗓 @created : 10/1/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportDetailsByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [exportFile] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`)
                    .where('pe.uuid', uuid);
                return exportFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ExportRepo();
//# sourceMappingURL=export.repo.js.map