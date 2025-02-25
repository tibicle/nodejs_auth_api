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
// Import Libraries
// Import services
// Import helper
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
//  Import Repo
const library_repo_1 = __importDefault(require("../repo/library.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get library data service
🗓 @created : 29/09/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getLibraryList = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield library_repo_1.default.getAllLibraryData(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the library data
            //
            const data = yield library_repo_1.default.getAllLibraryData(container, 'libraryData');
            for (const file of data) {
                if (container.input.query.company_uuid) {
                    //
                    //  get the folder
                    //
                    var folder = yield s3Folder_helper_1.default.getFolderPath(container.input.query.company_uuid, file.user_uuid, file.file_name);
                }
                else {
                    //
                    //  get the folder
                    //
                    var folder = yield s3Folder_helper_1.default.getFolderPath(container.input.query.company_uuid, file.user_uuid, file.file_name);
                }
                file.file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}/${file.file_name}`;
                if (file.low_res_file_name) {
                    file.low_res_file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}/${file.low_res_file_name}`;
                }
                else {
                    file.low_res_file_url = null;
                }
                if (file.thumbnail_file_name) {
                    file.thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}/${file.thumbnail_file_name}`;
                }
                else {
                    file.thumbnail_url = null;
                }
            }
            container.output.result = data;
        }
        else {
            container.output.result = [];
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getLibraryList;
//# sourceMappingURL=libraryList.service.js.map