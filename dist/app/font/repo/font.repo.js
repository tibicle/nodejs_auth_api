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
class FontRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save font data
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveFontData(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fontData = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .insert(dataModel)
                    .returning('uuid');
                return fontData;
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
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .whereRaw(`LOWER("title") LIKE '%${title.toLowerCase()}%'`);
                if (checkTitle) {
                    const err = new Error(i18n_1.default.__('font.title_exists'));
                    err.statusCode = 400;
                    throw err;
                }
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
    🚩 @uses : list all font details with total count
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllFontData(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let fontQuery = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT} as f`)
                    .select('f.uuid', 'f.title', 'f.created_at', 'f.status')
                    .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as uploaded_by"))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'f.created_by');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listFontFilters(container, fontQuery);
                    let results = yield fontQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'fontData') {
                    fontQuery
                        .select('f.uuid', 'f.title', 'f.created_at', 'f.status', 'f.font_details')
                        .select(database_1.default.raw("NULLIF(CONCAT_WS(' ', NULLIF(u.first_name, ''), NULLIF(u.last_name, '')), '') as uploaded_by"));
                    //
                    //  search filter 
                    //
                    this.listFontFilters(container, fontQuery);
                    if (query.per_page &&
                        query.page) {
                        fontQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        fontQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield fontQuery;
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
    🚩 @uses : list font filter
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listFontFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by uploaded by
                //
                if (query.uploaded_by) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.uploaded_by.toLowerCase()}%'`);
                }
                //
                //  filter by title
                //
                if (query.title) {
                    searchQuery.whereRaw(`LOWER(f.title) LIKE '%${query.title.toLowerCase()}%'`);
                }
                //
                //  filter by status
                //
                if (query.status) {
                    searchQuery.andWhere('f.status', `${query.status}`);
                }
                //
                //  filter by uuid
                //
                if (query.font_uuid) {
                    searchQuery.andWhere('f.uuid', query.font_uuid);
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
    🚩 @uses : get all fonts
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllFont(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query } } = container;
                const allFonts = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .where('status', constant_1.default.status.ACTIVE);
                if (query.font_uuid) {
                    allFonts.andWhere('uuid', query.font_uuid);
                }
                yield allFonts;
                return allFonts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check font exists or not
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFontByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [font] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .where('uuid', uuid);
                if (!font) {
                    const err = new Error(i18n_1.default.__('font.not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return font;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update font details
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateFontDetails(uuid, updateDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fontDetails = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .update(updateDataModel)
                    .where('uuid', uuid);
                return fontDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check font title exists or not
    🗓 @created : 19/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFontTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .whereRaw(`LOWER("title") LIKE '%${title.toLowerCase()}%'`);
                if (checkTitle) {
                    const err = new Error(i18n_1.default.__('font.title_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return checkTitle;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : check font by font name
   🗓 @created : 28/10/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getFontByName(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [checkTitle] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .select('title', 'font_details')
                    .whereRaw(`LOWER("title") LIKE '%${title.toLowerCase()}%'`);
                return checkTitle;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get font data
    🗓 @created : 28/10/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFontData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fontData = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FONT}`)
                    .where('status', constant_1.default.status.ACTIVE)
                    .select('title', 'font_details')
                    .orderBy('created_at', 'desc')
                    .first();
                return fontData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new FontRepo();
//# sourceMappingURL=font.repo.js.map