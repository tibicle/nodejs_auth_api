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
class ErrorLogRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all static page details with total count
    🗓 @created : 04/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllErrorData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let errorLogPageQuery = (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.ERROR_LOG_STATUS} as els`)
                    .select('els.uuid', 'p.name as production_name', 'els.comment', 'els.status', 'els.created_by', 'els.created_at', 'u.email', 'pe.error_log as error_name', 'els.type as type')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`, 'pe.uuid', 'els.production_export_uuid')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION} as p`, 'pe.production_uuid', 'p.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'pe.created_by', 'u.uuid');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listErrorLogFilters(container, errorLogPageQuery);
                    let results = yield errorLogPageQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'errorData') {
                    errorLogPageQuery
                        .select('els.uuid', 'p.name as production_name', 'els.comment', 'els.status', 'els.created_by', 'els.created_at', 'u.email', 'pe.error_log as error_name', 'els.type as type');
                    //
                    //  search filter 
                    //
                    this.listErrorLogFilters(container, errorLogPageQuery);
                    if (query.per_page &&
                        query.page) {
                        errorLogPageQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        errorLogPageQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield errorLogPageQuery;
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
    🚩 @uses : list error log filter
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listErrorLogFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.whereRaw(`LOWER(p.name) LIKE '%${query.name.toLowerCase()}%'`);
                }
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('els.status', `${query.status}`);
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
    🚩 @uses : get error details by uuid
    🗓 @created : 18/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getErrorDetailsByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [errorData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.ERROR_LOG_STATUS} as els`)
                    .select('pe.error_log')
                    .leftJoin(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.PRODUCTION_EXPORT} as pe`, 'pe.uuid', 'els.production_export_uuid')
                    .where('els.uuid', uuid);
                return errorData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check error log exists or not
    🗓 @created : 18/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkLogByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [errorData] = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.ERROR_LOG_STATUS}`)
                    .where('uuid', uuid);
                if (!errorData) {
                    const err = new Error(i18n_1.default.__('error_log.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return errorData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update error log
    🗓 @created : 18/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateLogDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorialDetails = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.ERROR_LOG_STATUS}`)
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
    🚩 @uses : save log details
    🗓 @created : 09/01/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveLogDetails(data) {
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
}
exports.default = new ErrorLogRepo();
//# sourceMappingURL=errorLog.repo.js.map