'use strict';
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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
// Import Libraries
// Import services
//  Import Repo
const library_repo_1 = __importDefault(require("../repo/library.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get library details service
🗓 @created : 27/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const libraryFileDetailService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { libraryDetails } } = container;
        container.derived.tagData = [];
        container.derived.library = yield library_repo_1.default.getLibraryDetails(params.uuid);
        if (!container.derived.library) {
            const err = new Error(i18n_1.default.__('library.no_library_found'));
            err.statusCode = 400;
            throw err;
        }
        //
        // get tag name by using tag_uuid
        //
        yield getTagName(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get tag name by tag uuid
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTagName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user }, derived: { library } } = container;
        if (library.tag_uuid != null) {
            for (let i = 0; i < library.tag_uuid.length; i++) {
                //
                // store the tag name with uuid
                //
                const tagDetail = yield library_repo_1.default.getTagNameByUuid(library.tag_uuid[i]);
                container.derived.tagData.push(tagDetail);
            }
        }
        library.tag = container.derived.tagData;
        if (query.company_uuid) {
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getFolderPath(query.company_uuid, logged_in_user.uuid, library.file_name);
        }
        else {
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getFolderPath(query.company_uuid, logged_in_user.uuid, library.file_name);
        }
        library.file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}/${library.file_name}`;
        if (library.low_res_name) {
            library.low_res_file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}/${library.low_res_name}`;
        }
        else {
            library.low_res_file_url = null;
        }
        container.output.result = library;
        delete (container.output.result.tag_uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = libraryFileDetailService;
//# sourceMappingURL=getLibraryFileDetail.service.js.map