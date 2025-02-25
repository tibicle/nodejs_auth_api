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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const font_repo_1 = __importDefault(require("../repo/font.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : add font service
🗓 @created : 07/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFontService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check title
        //
        yield font_repo_1.default.checkFontByUuid(params.uuid);
        //
        //  validate font details
        //
        yield validateFontDetails(container);
        //
        //  update font data
        //
        yield updateFont(container);
        container.output.message = i18n_1.default.__('font.font_details_update');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate font details
🗓 @created : 07/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateFontDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  validate details array should not be empty
        //
        if (body.details.length == 0) {
            const err = new Error(i18n_1.default.__('font.font_details_empty'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  check file uuid is valid or not
        //
        for (let data of body.details) {
            if (data.file_uuid != null) {
                const fileDetail = yield file_repo_1.default.getFileByUuid(data.file_uuid);
                if (!fileDetail) {
                    const err = new Error(i18n_1.default.__('no_file_found'));
                    err.statusCode = 400;
                    throw err;
                }
                data.file_url = `${constant_1.default.app.CLOUDFRONT_URL}/fonts/${fileDetail.name}`;
            }
            else {
                data.file_url = null;
                continue;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update font details
🗓 @created : 07/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFont = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        //
        //  Prepare the model to update status
        //
        const updateFontDataModel = {
            title: body.title,
            font_details: JSON.stringify(body.details),
            visibility: constant_1.default.font_visibility.PUBLIC,
            status: constant_1.default.status.ACTIVE,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  update the font status
        //
        yield font_repo_1.default.updateFontDetails(params.uuid, updateFontDataModel);
        for (let data of body.details) {
            //
            //  prepare data model to update file data
            //
            const updateFileDataModel = {
                ref_uuid: params.uuid,
                ref_type: 'FONT'
            };
            //
            //  update file data
            //
            yield file_repo_1.default.updateFiledata(data.file_uuid, updateFileDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateFontService;
//# sourceMappingURL=updateFont.service.js.map