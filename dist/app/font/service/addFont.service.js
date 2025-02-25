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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const font_repo_1 = __importDefault(require("../repo/font.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : add font service
🗓 @created : 19/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addFontService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  check title
        //
        yield font_repo_1.default.checkTitle(body.title.toLowerCase());
        //
        //  validate font details json object
        //
        yield validateFontDetails(container);
        //
        //  save font data
        //
        yield saveFontData(container);
        container.output.message = i18n_1.default.__('font.save_font_success');
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
👑 @creator : Bhavya Nayak
🚩 @uses : save font data
🗓 @created : 19/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFontData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  prepare data model to save font data
        //
        const saveFontDataModel = {
            title: body.title,
            font_details: JSON.stringify(body.details),
            visibility: constant_1.default.font_visibility.PUBLIC,
            status: constant_1.default.status.ACTIVE,
            created_by: logged_in_user.uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  save font data
        //
        const [saveFont] = yield font_repo_1.default.saveFontData(saveFontDataModel);
        for (let data of body.details) {
            //
            //  prepare data model to update file data
            //
            const updateFileDataModel = {
                ref_uuid: saveFont.uuid,
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
exports.default = addFontService;
//# sourceMappingURL=addFont.service.js.map