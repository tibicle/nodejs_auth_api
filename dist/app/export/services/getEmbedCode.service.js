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
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Models
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get export auto settings service
🗓 @created : 04/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getEmbedVideoService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        //
        //  check export file exists or not 
        //
        container.derived.exportDetail = yield export_repo_1.default.getExportDetailsByEmbedCode(query.embed_code);
        //
        //  set response
        //
        yield embedResponse(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : set ebed code response
🗓 @created : 04/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const embedResponse = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, query }, derived: { exportDetail } } = container;
        let folder;
        let folderThumbnail;
        const exportDetails = yield export_repo_1.default.getExportVideoDetailsByEmbedCode(query.embed_code);
        if (exportDetails.production_company) {
            const productionDetails = {
                name: exportDetails.production_name,
                uuid: exportDetails.production_uuid
            };
            //
            //  get the folder
            //
            folder = yield s3Folder_helper_1.default.getProductionFolderPath(exportDetails.production_company, null, exportDetails.file_name, productionDetails);
            folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(exportDetails.production_company, null, exportDetails.thumbnail_file_name, productionDetails);
            if (exportDetail.embed_thumbnail != null) {
                //
                //  get file by uuid
                //
                var fileDetails = yield file_repo_1.default.getFileByUuid(exportDetail.embed_thumbnail);
                const embedThumbnail = folder.split('/').slice(0, -1).join('/');
                var updatedUrl = `${constant_1.default.app.CLOUDFRONT_URL}/${embedThumbnail}/${fileDetails.name}`;
            }
        }
        else if (exportDetails.production_user) {
            const productionDetails = {
                name: exportDetails.production_name,
                uuid: exportDetails.production_uuid
            };
            //
            //  get the folder
            //
            folder = yield s3Folder_helper_1.default.getProductionFolderPath(null, exportDetails.production_user, exportDetails.file_name, productionDetails);
            folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(null, exportDetails.production_user, exportDetails.thumbnail_file_name, productionDetails);
            if (exportDetail.embed_thumbnail != null) {
                //
                //  get file by uuid
                //
                var fileDetails = yield file_repo_1.default.getFileByUuid(exportDetail.embed_thumbnail);
                const embedThumbnail = folder.split('/').slice(0, -1).join('/');
                var updatedUrl = `${constant_1.default.app.CLOUDFRONT_URL}/${embedThumbnail}/${fileDetails.name}`;
            }
        }
        const file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}`;
        var thumbnail_url;
        if (exportDetails.thumbnail_file_name != null) {
            thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folderThumbnail}`;
        }
        else {
            thumbnail_url = null;
        }
        //
        //  get path of hls video
        //
        const hslFilePath = folder ? folder.split('/').slice(0, -1).join('/') : null;
        //
        // get production timeline data by production uuid
        //
        const firstSequenceData = yield production_repo_1.default.getProductionTimelineByProductionUuid(exportDetails.production_uuid);
        var tempThumbnailImage = null;
        if (firstSequenceData) {
            for (let data of firstSequenceData) {
                if (data.layer_type == 'VIDEO') {
                    //
                    //  get file data
                    //
                    const fileData = yield file_repo_1.default.getFileByUuid(data.file_uuid);
                    var libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileData.uuid);
                    var folderPath = yield s3Folder_helper_1.default.getFolderPath(exportDetails.production_company, libraryDetails ? libraryDetails.user_uuid : null, fileData.name);
                    tempThumbnailImage = `${constant_1.default.app.CLOUDFRONT_URL}/` + folderPath + `/${fileData.thumbnail_file_name}`;
                    break;
                }
                else if (data.layer_type == 'IMAGE') {
                    //
                    //  get file data
                    //
                    const fileData = yield file_repo_1.default.getFileByUuid(data.file_uuid);
                    var libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileData.uuid);
                    var folderPath = yield s3Folder_helper_1.default.getFolderPath(exportDetails.production_company, libraryDetails ? libraryDetails.user_uuid : null, fileData.name);
                    tempThumbnailImage = `${constant_1.default.app.CLOUDFRONT_URL}/` + folderPath + `/${fileData.name}`;
                    break;
                }
                else {
                    continue;
                }
            }
        }
        else {
            tempThumbnailImage = `${constant_1.default.app.CLOUDFRONT_URL}/1732270358697_bottomimage.png`;
        }
        const embedResponse = {
            uuid: exportDetails.uuid,
            production: {
                name: exportDetails.production_name,
                uuid: exportDetails.production_uuid
            },
            hls_video_url: file_url,
            hls_file_path: `${constant_1.default.app.CLOUDFRONT_URL}/${hslFilePath}/output_hls_${exportDetails.uuid}/${exportDetails.embed_hls_file_name}`,
            hls_video_thumbnail: exportDetail.embed_thumbnail == null ? thumbnail_url : updatedUrl,
            logo_url: tempThumbnailImage,
        };
        container.output.result = embedResponse;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getEmbedVideoService;
//# sourceMappingURL=getEmbedCode.service.js.map