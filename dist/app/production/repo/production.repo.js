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
class ProductionRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete library file from production media
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProductionMedia(libraryUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .where('library_uuid', libraryUuid)
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
    🚩 @uses : get total production data
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTotalProductionData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                const totalProductionData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .count('* as total_results');
                //
                //  filter by company uuid
                //
                if (query.company_uuid) {
                    totalProductionData.andWhere('company_uuid', `${query.company_uuid}`);
                }
                else {
                    totalProductionData.andWhere('company_uuid', null)
                        .where('user_uuid', logged_in_user.uuid);
                }
                //
                //  filter by name
                //
                if (query.name) {
                    totalProductionData.whereRaw(`(LOWER("name") LIKE '%${query.name.toLowerCase()}%')`);
                }
                // 
                // filter data from date till today
                // 
                if (query.from) {
                    totalProductionData.where('created_at', ">=", `${query.from}`);
                }
                // 
                // filter data till given date 
                // 
                if (query.to) {
                    totalProductionData.where('created_at', "<=", `${query.to}`);
                }
                // 
                // filter data according to status
                // 
                if (query.status) {
                    totalProductionData.where('status', "=", `${query.status}`);
                }
                const [results] = yield totalProductionData;
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
    🚩 @uses : get production data
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                const productionData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                    .select('p.*');
                // .where('p.user_uuid',logged_in_user.uuid)
                //
                //  filter by company uuid
                //
                if (query.company_uuid) {
                    productionData.andWhere('p.company_uuid', `${query.company_uuid}`);
                }
                else {
                    productionData.andWhere('p.company_uuid', null)
                        .where('user_uuid', logged_in_user.uuid);
                }
                //
                //  filter by name
                //
                if (query.name) {
                    productionData.whereRaw(`(LOWER("p"."name") LIKE '%${query.name.toLowerCase()}%')`);
                }
                // 
                // filter data from date till today
                // 
                if (query.from) {
                    productionData.where('p.created_at', ">=", `${query.from}`);
                }
                // 
                // filter data till given date 
                // 
                if (query.to) {
                    productionData.where('p.created_at', "<=", `${query.to}`);
                }
                // 
                // filter data according to status
                // 
                if (query.status) {
                    productionData.where('p.status', "=", `${query.status}`);
                }
                //
                // filter data by updated at 
                //
                if (query.sort_by && query.sort_value) {
                    productionData.orderBy(query.sort_by, query.sort_value);
                }
                if (query.per_page &&
                    query.page) {
                    productionData.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    productionData.offset((query.page - 1) * query.per_page);
                }
                return yield productionData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get total production media data
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTotalProductionMediaData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user, params } } = container;
                const totalProductionMediaData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                    .count('* as total_results')
                    .where('production_uuid', params.uuid);
                const [results] = yield totalProductionMediaData;
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
    🚩 @uses : get production media data
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionMediaData(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user, params } } = container;
                const productionMediaData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                    .select('l.uuid', 'l.user_uuid', 'pm.uuid as media_uuid', 'l.file_uuid', 'f.name', 'f.type', 'f.length as video_length', 'f.quality', 'f.size', 'f.thumbnail_file_name', 'f.created_at', 'l.name as display_name', 'lf.uuid as low_res_file_uuid', 'lf.name as low_res_file_name')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                    .select(database_1.default.raw(`CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END as thumbnail_url`))
                    .select(database_1.default.raw(`CASE WHEN f.audio_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.audio_name)) ELSE NULL END as audio_url`))
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`, 'l.uuid', 'pm.library_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'l.file_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE} as lf`, 'lf.file_uuid', 'f.uuid')
                    .where('production_uuid', params.uuid)
                    .whereNot('f.status', 'PROCESSING');
                if (query.per_page &&
                    query.page) {
                    productionMediaData.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    productionMediaData.offset((query.page - 1) * query.per_page);
                }
                return yield productionMediaData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check production exists or not
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkProductionByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [production] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .where('uuid', uuid);
                if (!production) {
                    const err = new Error(i18n_1.default.__('production.no_production_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return production;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get production media details by production uuid
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionMediaByUuid(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionMedia = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .where('production_uuid', productionUuid);
                return productionMedia;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save prodcution media
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveProductionMedia(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .insert(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check file exists in production media or not
    🗓 @created : 17/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFileInProductionMedia(productionUuid, fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionMedia] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA} as pm`)
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as l`, 'l.uuid', 'pm.library_uuid')
                    .where('pm.production_uuid', productionUuid)
                    .andWhere('l.file_uuid', fileUuid);
                if (!productionMedia) {
                    const err = new Error(i18n_1.default.__('production_media.no_file_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return productionMedia;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : add layer into production timeline
    🗓 @created : 18/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    addLayerInProductionTimeLine(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const layer = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .insert(data)
                    .returning('*');
                return layer;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update layer data using transaction
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateLayerDataTrx(uuid, data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trx) {
                    const [layerData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                        .where('uuid', uuid)
                        .update(data)
                        .returning('*')
                        .transacting(trx);
                    return { layerData, trx };
                }
                else {
                    const trx = yield database_1.default.transaction();
                    const [layerData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                        .where('uuid', uuid)
                        .update(data)
                        .returning('*')
                        .transacting(trx);
                    return { layerData, trx };
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
    🚩 @uses : delete layer data using transaction
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteLayerDataTrx(uuid, productionUuid, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .whereNotIn('uuid', uuid)
                    .where('sequence_uuid', productionUuid)
                    .del()
                    .transacting(trx);
                yield trx.commit();
            }
            catch (error) {
                yield trx.rollback();
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get layers by porduction uuid
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLayerByProductionUuid(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, params, query } } = container;
                let layerData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE} as pt`)
                    .select('pt.uuid', 'pt.layer_type', 'pt.layer_data', 'pt.sort_order', 'pt.sequence_uuid', 'li.user_uuid as user_uuid')
                    .select(database_1.default.raw(`json_build_object(
                'uuid', f.uuid,
                'length', f.length,
                'size', f.size,
                'quality', f.quality,
                'name',f.name,
                'status',f.status,
                'display_name',li.name,
                'audio',f.audio_name,
                'thumbnail',f.thumbnail_file_name,
                'url', CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END,
                'thumbnail_url', CASE WHEN f.thumbnail_file_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.thumbnail_file_name)) ELSE NULL END,
                'audio_url', CASE WHEN f.audio_name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.audio_name)) ELSE NULL END,
                'frames', vf.frame,
                'low_resolution_name',lf.name
                ) as file_data`))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'pt.file_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE} as lf`, 'lf.file_uuid', 'f.uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY} as li`, 'li.file_uuid', 'f.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.VIDEO_FRAME} as vf`, 'vf.file_uuid', 'pt.file_uuid')
                    .where('pt.production_uuid', params.production_uuid)
                    .andWhere('pt.sequence_uuid', query.sequence_uuid)
                    .orderBy('pt.sort_order', 'asc');
                if (query.timeline_uuid) {
                    if (Array.isArray(query.timeline_uuid)) {
                        layerData.whereIn('pt.uuid', query.timeline_uuid);
                    }
                    else {
                        layerData.where('pt.uuid', query.timeline_uuid);
                    }
                }
                return yield layerData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert data in production database
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    storeProductionDetail(productionModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .insert(productionModel)
                    .returning('*');
                return productionData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check category
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [categoryData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.CATEGORY}`)
                    .whereRaw("LOWER(title) = LOWER(?)", [category.trim()]);
                return categoryData;
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
    🗓 @created : 31/10/2023
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
    🗓 @created : 31/10/2023
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
    👑 @creator : Sushant Shekhar
    🚩 @uses : validate the name is already present or not
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateName(name, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [nameData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as r`)
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
🚩 @uses : get tag data
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
    🚩 @uses : check production exists or not
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [production] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'p.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f `, 'f.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uu`, 'uu.uuid', 'p.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as ff`, 'ff.uuid', 'uu.file_uuid')
                    .where('p.uuid', uuid)
                    .select('p.uuid', 'p.category_uuid', 'p.user_uuid', 'p.name', 'p.description', 'p.status', 'p.export_url', 'p.deadline', 'p.project_type', 'p.production_idea', 'p.production_style', 'p.created_at', 'p.updated_at', 'p.is_active', 'p.company_uuid', database_1.default.raw(`json_build_object(
                                                'uuid', u.uuid,
                                                'first_name', u.first_name,
                                                'last_name', u.last_name,
                                                'profile_pic', CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END
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
                                              `));
                if (!production) {
                    const err = new Error(i18n_1.default.__('production.no_production_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return production;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get sort order by production uuid
    🗓 @created : 09/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSortOrder(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [sortOrder] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .select('sort_order')
                    .where('production_uuid', uuid)
                    .orderBy('sort_order', 'desc');
                return sortOrder;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    👑 @creator : Sushant Shekhar
    🚩 @uses : update production details
    🗓 @created : 03/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateProductionDetails(uuid, updateProductionModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateProduction = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .where('uuid', uuid)
                    .update(updateProductionModel);
                return updateProduction;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete the timeline layers
    🗓 @created : 09/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteLayer(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('sequence_uuid', productionUuid)
                    .del();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete production timeline by production_uuid
    🗓 @created : 30/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProductionTimeline(uuid, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trx = yield database_1.default.transaction();
                const [productionTimelineData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .del()
                    .where('production_uuid', uuid)
                    .returning('*')
                    .transacting(trx);
                return { productionTimelineData, trx };
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete production timeline by production_uuid
    🗓 @created : 30/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    productionMediaDelete(uuid, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionMediaData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .del()
                    .where('production_uuid', uuid)
                    .returning('*')
                    .transacting(trx);
                return { productionMediaData, trx };
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete production timeline by production_uuid
    🗓 @created : 30/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProductionExport(uuid, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionExportData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT}`)
                    .del()
                    .where('production_uuid', uuid)
                    .returning('*')
                    .transacting(trx);
                return { productionExportData, trx };
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete production timeline by production_uuid
    🗓 @created : 30/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProduction(uuid, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .del()
                    .where('uuid', uuid)
                    .returning('*')
                    .transacting(trx);
                yield trx.commit();
                return productionData;
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get file details by production uuid from production timeline
    🗓 @created : 04/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFileDetailsByProductionUuid(production_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionTimelineDetails = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('production_uuid', production_uuid);
                return productionTimelineDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check production exists or not
    🗓 @created : 09/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkProductionExistsOrNot(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [production] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                    .whereRaw("LOWER(p.name) = LOWER(?)", [name.trim()]);
                if (production) {
                    const err = new Error(i18n_1.default.__("production.name_already_exist"));
                    err.statusCode = 400;
                    throw err;
                }
                return production;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check production media exists or not
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkProductionMediaByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionMedia] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .where('uuid', uuid);
                if (!productionMedia) {
                    const err = new Error(i18n_1.default.__('production.no_production_media_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return productionMedia;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get timeline data
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTimelineData(fileUuid, productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [timeLineData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('file_uuid', fileUuid)
                    .andWhere('production_uuid', productionUuid);
                return timeLineData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete timeline data
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteTimeline(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .del()
                    .where('uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete production media
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProductionMediaByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .del()
                    .where('uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get sequence by production uuid
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSequenceByProductionUuid(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sequenceData = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .select('uuid', 'title', 'last_selected')
                    .where('production_uuid', productionUuid)
                    .orderBy('created_at', 'asc');
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all sequence
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sequenceData = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`);
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save sequence data
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveSequence(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [sequenceData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .insert(dataModel)
                    .returning('*');
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check sequence exists or not
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkSequence(sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [sequenceData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .where('uuid', sequenceUuid);
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update sequence data
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateSequence(sequenceUuid, dataModel, productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sequenceData = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .update(dataModel);
                if (productionUuid) {
                    sequenceData
                        .where('production_uuid', productionUuid)
                        .whereNot('uuid', sequenceUuid);
                }
                else {
                    sequenceData
                        .where('uuid', sequenceUuid);
                }
                return yield sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete production timeline sequence
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProductionTimelineSequence(sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('sequence_uuid', sequenceUuid)
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
    🚩 @uses : delete sequence
    🗓 @created : 15/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteSequence(sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .where('uuid', sequenceUuid)
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
    🚩 @uses : get first sequence
    🗓 @created : 14/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFirstSequence(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [sequenceData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .where('title', i18n_1.default.__('production.sequence_prefix'))
                    .andWhere('production_uuid', productionUuid);
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all production uuid by user uuid
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllProductionByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUuid = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .select('uuid')
                    .where('user_uuid', userUuid)
                    .andWhere('company_uuid', null);
                const productionUuids = productionUuid.map(item => item.uuid);
                return productionUuids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all production details by company uuid
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllProductionByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUuid = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .select('uuid')
                    // .where('user_uuid',userUuid)
                    .where('company_uuid', companyUuid);
                const productionUuids = productionUuid.map(item => item.uuid);
                return productionUuids;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get production media by library uuid
    🗓 @created : 10/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionMediaByLibraryUuid(libraryUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionMedia = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_MEDIA}`)
                    .where('library_uuid', libraryUuid);
                return productionMedia;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteProductionTimelineFromLibrary(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionTimelineData = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .del()
                    .where('file_uuid', uuid);
                // .returning('*')
                // .transacting(trx)
                // return productionTimelineData
            }
            catch (error) {
                // await trx.rollback();
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get multiple time line data
    🗓 @created : 09/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getMultipleTimelineData(fileUuid, productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeLineData = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('file_uuid', fileUuid)
                    .andWhere('production_uuid', productionUuid);
                return timeLineData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate production name for particular company
    🗓 @created : 19/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateProductionNameForCompany(name, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
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
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate production name for self
    🗓 @created : 19/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateProductionNameForSelf(name, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere("user_uuid", userUuid);
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
    🚩 @uses : get user production usage
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserProductionUsage(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [usage] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .sum('s3_usage as total_usage')
                    .whereIn('uuid', productionUuid);
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
    🚩 @uses : list all sequence by production uuid
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllSequenceByProductionUuid(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user, params } } = container;
                let sequenceQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE} as ps`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'ps.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f `, 'f.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as us`, 'us.uuid', 'ps.updated_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fs `, 'fs.uuid', 'us.file_uuid')
                    .where('ps.production_uuid', params.production_uuid);
                if (str == 'CountTotalData') {
                    sequenceQuery
                        .count('* as total_results');
                    //
                    //get total count after search filter
                    //
                    this.searchFilter(container, sequenceQuery);
                    let [results] = yield sequenceQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'productionSequence') {
                    sequenceQuery
                        .select('ps.uuid', 'ps.title as sequence_name', 'ps.status', 'ps.updated_at', 'ps.dead_line', 'ps.aspect_ratio', database_1.default.raw(`json_build_object(
                    'uuid', u.uuid,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'profile_pic', CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END
                    ) as created_by`), database_1.default.raw(`
                    CASE 
                        WHEN us.updated_by IS NULL THEN NULL 
                        ELSE json_build_object(
                        'uuid', us.uuid,
                        'first_name', us.first_name,
                        'last_name', us.last_name,
                        'profile_pic', CASE WHEN fs.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fs.name)) ELSE NULL END
                        )
                    END as modify_by
                    `))
                        .orderBy('ps.created_at', 'desc');
                    //
                    //search filter 
                    //
                    this.searchFilter(container, sequenceQuery);
                    if (query.per_page &&
                        query.page) {
                        sequenceQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        sequenceQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield sequenceQuery;
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
    🚩 @uses : search filter for production sequence list
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    searchFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
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
   🚩 @uses : get sequence by production uuid
   🗓 @created : 13/03/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getSequenceBySequenceUuid(sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [sequenceData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .select('*')
                    .where('uuid', sequenceUuid);
                return sequenceData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get timeline data
    🗓 @created : 23/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTimelineDataBySequenceUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeLineData = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                    .where('sequence_uuid', uuid);
                return timeLineData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : add layer into production timeline
    🗓 @created : 18/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    addProductionTimeLineTransaction(data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const layer = yield database_1.default.batchInsert(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`, data)
                    .transacting(trx);
                yield trx.commit();
            }
            catch (error) {
                yield trx.rollback();
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
    productionMemberList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                if (str == 'libraryData') {
                    let exportQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                        .select('p.uuid', database_1.default.raw(`
                        json_build_object(
                            'uuid', u.uuid,
                            'first_name', u.first_name,
                            'last_name', u.last_name,
                            'profile_pic', CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END,
                            'updated_at', MAX(pe.updated_at),
                            'created_at', MAX(pe.created_at)
                        ) AS member,
                        COALESCE(SUM(pe.total_time), 0)::integer as total_time,
                        u.uuid as user_uuid
                    `))
                        .where('p.uuid', query.production_uuid)
                        .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`, 'pe.production_uuid', 'p.uuid')
                        .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'pe.created_by')
                        .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                        .whereNotNull('pe.created_by')
                        .groupBy('p.uuid', 'u.uuid', 'f.name', 'u.first_name', 'u.last_name');
                    let sequenceQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                        .select('p.uuid', database_1.default.raw(`
                        json_build_object(
                            'uuid', ups.uuid,
                            'first_name', ups.first_name,
                            'last_name', ups.last_name,
                            'profile_pic', CASE WHEN fps.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fps.name)) ELSE NULL END,
                            'updated_at', MAX(ps.updated_at),
                            'created_at', MAX(ps.created_at)
                        ) AS member,
                        0::integer as total_time,
                        ups.uuid as user_uuid
                    `))
                        .where('p.uuid', query.production_uuid)
                        .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE} as ps`, 'ps.production_uuid', 'p.uuid')
                        .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as ups`, 'ups.uuid', 'ps.created_by')
                        .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fps`, 'fps.uuid', 'ups.file_uuid')
                        .whereNotNull('ps.created_by')
                        .groupBy('p.uuid', 'ups.uuid', 'fps.name', 'ups.first_name', 'ups.last_name');
                    let memberQuery = database_1.default
                        .with('combined_data', function () {
                        this.unionAll([exportQuery, sequenceQuery]);
                    })
                        .select('uuid', 'member', 'total_time', 'user_uuid')
                        .from('combined_data')
                        .distinctOn('user_uuid')
                        .orderBy(['user_uuid', { column: 'total_time', order: 'desc' }]);
                    if (query.per_page &&
                        query.page) {
                        memberQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        memberQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield memberQuery;
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
   🚩 @uses : save sequence data
   🗓 @created : 13/03/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    saveSequenceTransaction(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trx = yield database_1.default.transaction();
                const [sequenceData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .insert(dataModel)
                    .returning('*')
                    .transacting(trx);
                return { sequenceData, trx };
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
    productionCreatorDetails(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let memberQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`)
                    .select('p.uuid', database_1.default.raw(`
                        json_build_object(
                            'uuid', u.uuid,
                            'first_name', u.first_name,
                            'last_name', u.last_name,
                            'profile_pic', CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END,
                            'updated_at', p.updated_at,
                            'created_at', p.created_at
                        ) AS member,
                         0::integer as total_time
                    `))
                    .where('p.uuid', query.production_uuid)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'p.created_by')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid');
                if (query.per_page &&
                    query.page) {
                    memberQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    memberQuery.offset((query.page - 1) * query.per_page);
                }
                return yield memberQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get production details
    * 🗓 Created : 25/10/2024
    */
    getProductionByProductionUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [production] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION}`)
                    .where('uuid', uuid);
                if (!production) {
                    const err = new Error(i18n_1.default.__('production.no_production_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return production;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : save sequence data
    🗓 @created : 13/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionTimelineByProductionUuid(productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [productionData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .select('uuid')
                    .where('production_uuid', productionUuid)
                    .orderBy('created_at', 'asc');
                if (productionData) {
                    var sequenceDataThumbnail = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_TIMELINE}`)
                        .select('file_uuid', 'layer_type')
                        .where('sequence_uuid', productionData.uuid);
                }
                else {
                    sequenceDataThumbnail = [];
                }
                return sequenceDataThumbnail;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : validate the sequence name is already present or not
    🗓 @created : 15/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateSequenceName(name, productionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [nameData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_SEQUENCE}`)
                    .whereRaw("LOWER(title) = LOWER(?)", [name.trim()])
                    .andWhere('production_uuid', productionUuid);
                return nameData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ProductionRepo();
//# sourceMappingURL=production.repo.js.map