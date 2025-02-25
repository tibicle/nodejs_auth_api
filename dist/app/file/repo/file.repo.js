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
class fileRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save file
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveFileData(FileModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileUuid = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .insert(FileModelData)
                    .returning('uuid');
                return fileUuid;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to check is file saved or not
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFile(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [file] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .where('uuid', uuid);
                if (!file) {
                    const err = new Error(i18n_1.default.__('no_file_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return file;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update reference details
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateFiledata(uuid, fileModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .where('uuid', uuid)
                    .update(fileModelData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check file by name
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFileByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [file] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .where('name', name);
                return file;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete profile picture from file if it exists
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteProfilePicture(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .where('ref_uuid', uuid)
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
    🚩 @uses : get total video
    🗓 @created : 22/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTotalVideo(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query } } = container;
                const totalVideo = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`)
                    .count('f.uuid as total_results');
                const [results] = yield totalVideo;
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
    🚩 @uses : get video
    🗓 @created : 22/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideo(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                const video = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`)
                    .select('f.uuid', 'f.name', 'f.content_type as type')
                    .select(database_1.default.raw(`TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) as url`))
                    .orderBy('f.created_at', 'desc');
                if (query.per_page &&
                    query.page) {
                    video.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    video.offset((query.page - 1) * query.per_page);
                }
                return yield video;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get file by uuid
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFileByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [file] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .where('uuid', uuid);
                return file;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete file
    🗓 @created : 03/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteFileByuuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
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
    🚩 @uses : save pre signed file data
    🗓 @created : 09/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    savePreSignedFileData(FileModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [fileData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                    .insert(FileModelData)
                    .returning('*');
                return fileData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update file details using transaction
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateFiledataTrx(uuid, fileModelData, iteration, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (iteration == 0) {
                    const trx = yield database_1.default.transaction();
                    const [fileData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                        .where('uuid', uuid)
                        .update(fileModelData)
                        .returning('*')
                        .transacting(trx);
                    return { fileData, trx };
                }
                else {
                    const [fileData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE}`)
                        .where('uuid', uuid)
                        .update(fileModelData)
                        .returning('*')
                        .transacting(trx);
                    return { fileData, trx };
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
    🚩 @uses : save low resolution file
    🗓 @created : 17/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveLowResolutionFileData(FileModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [fileUuid] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE}`)
                    .insert(FileModelData)
                    .returning('uuid');
                return fileUuid;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update low resolution file details
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateLowResolutionFileData(uuid, fileModelData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE}`)
                    .where('uuid', uuid)
                    .update(fileModelData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get low resolution file details by file uuid
    🗓 @created : 19/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getLowResFileByFileUuid(fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [file] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.LOW_RESOLUTION_FILE}`)
                    .where('file_uuid', fileUuid);
                return file;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new fileRepo();
//# sourceMappingURL=file.repo.js.map