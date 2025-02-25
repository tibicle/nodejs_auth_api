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
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Libraries
// Import services
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get production data service
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getProductionList = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield production_repo_1.default.getTotalProductionData(container);
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the library data
            //
            const results = yield production_repo_1.default.getProductionData(container);
            for (let result of results) {
                //
                // get production timeline data by production uuid
                //
                const firstSequenceData = yield production_repo_1.default.getProductionTimelineByProductionUuid(result.uuid);
                let tempThumbnailImage = null;
                if (firstSequenceData) {
                    for (let data of firstSequenceData) {
                        if (data.layer_type == 'VIDEO') {
                            //
                            //  get file data
                            //
                            const fileData = yield file_repo_1.default.getFileByUuid(data.file_uuid);
                            var libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileData.uuid);
                            var folderPath = yield s3Folder_helper_1.default.getFolderPath(result.company_uuid, libraryDetails ? libraryDetails.user_uuid : null, fileData.name);
                            tempThumbnailImage = `${constant_1.default.app.CLOUDFRONT_URL}/` + folderPath + `/${fileData.thumbnail_file_name}`;
                            break;
                        }
                        else if (data.layer_type == 'IMAGE') {
                            //
                            //  get file data
                            //
                            const fileData = yield file_repo_1.default.getFileByUuid(data.file_uuid);
                            var libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileData.uuid);
                            var folderPath = yield s3Folder_helper_1.default.getFolderPath(result.company_uuid, libraryDetails ? libraryDetails.user_uuid : null, fileData.name);
                            tempThumbnailImage = `${constant_1.default.app.CLOUDFRONT_URL}/` + folderPath + `/${fileData.name}`;
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                }
                else {
                    tempThumbnailImage = null;
                }
                result.display_thumbnail = tempThumbnailImage;
            }
            container.output.result = results;
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
exports.default = getProductionList;
//# sourceMappingURL=getProductionList.service.js.map