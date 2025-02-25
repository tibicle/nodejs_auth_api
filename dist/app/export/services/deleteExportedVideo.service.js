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
const aws_1 = __importDefault(require("../../../library/aws"));
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
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete exported video service
🗓 @created : 29/04/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteExportedVideoService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        //
        //  check export file exists or not
        //
        container.derived.exportVideoDetails = yield export_repo_1.default.checkExportFileByUuid(params.uuid);
        //
        //  get production details to delete from S3
        //
        container.derived.productionDetails = yield production_repo_1.default.checkProductionByUuid(container.derived.exportVideoDetails.production_uuid);
        //
        //  get file details by uuid
        //
        container.derived.fileDetails = yield file_repo_1.default.checkFile(container.derived.exportVideoDetails.file_uuid);
        //
        //  delete hls video file from s3
        //
        yield deleteHlsVideo(container);
        //
        //  delete the exported video file
        //
        yield deleteVideo(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete video
🗓 @created : 29/04/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteVideo = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user }, derived: { productionDetails, fileDetails } } = container;
        //
        //  delete file from DB
        //
        //await exportRepo.deleteExportVideoByUuid(params.uuid);
        if (productionDetails.company_uuid) {
            const productionDetailsData = {
                name: productionDetails.name,
                uuid: productionDetails.uuid
            };
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, logged_in_user.uuid, fileDetails.name, productionDetailsData);
            if (fileDetails.thumbnail_file_name) {
                var folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, logged_in_user.uuid, fileDetails.thumbnail_file_name, productionDetailsData);
                yield aws_1.default.deleteFile(`${constant_1.default.app.AWS_BUCKET_NAME}`, folderThumbnail);
            }
        }
        else {
            const productionDetailsData = {
                name: productionDetails.name,
                uuid: productionDetails.uuid
            };
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, logged_in_user.uuid, fileDetails.name, productionDetailsData);
            if (fileDetails.thumbnail_file_name) {
                var folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, logged_in_user.uuid, fileDetails.thumbnail_file_name, productionDetailsData);
                yield aws_1.default.deleteFile(`${constant_1.default.app.AWS_BUCKET_NAME}`, folderThumbnail);
            }
        }
        //
        //  delete file from S3
        //
        yield aws_1.default.deleteFile(`${constant_1.default.app.AWS_BUCKET_NAME}`, folder);
        //
        //  delete file from file table
        //
        yield file_repo_1.default.deleteFileByuuid(fileDetails.uuid);
        //  
        // update export table is_deleted true
        //
        const exportIsDeleteModel = {
            is_deleted: true
        };
        yield export_repo_1.default.updateExportFileStatus(params.uuid, exportIsDeleteModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete hls video
🗓 @created : 06/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteHlsVideo = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user }, derived: { productionDetails, fileDetails, exportVideoDetails } } = container;
        if (productionDetails.company_uuid) {
            const productionDetailsData = {
                name: productionDetails.name,
                uuid: productionDetails.uuid
            };
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getHlsFolderPath(productionDetails.company_uuid, logged_in_user.uuid, exportVideoDetails.uuid, productionDetailsData);
        }
        else {
            const productionDetailsData = {
                name: productionDetails.name,
                uuid: productionDetails.uuid
            };
            //
            //  get the folder
            //
            var folder = yield s3Folder_helper_1.default.getHlsFolderPath(productionDetails.company_uuid, logged_in_user.uuid, exportVideoDetails.uuid, productionDetailsData);
        }
        //
        //  delete hls folder from S3
        //
        yield aws_1.default.deleteFolder(`${constant_1.default.app.AWS_BUCKET_NAME}`, folder);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteExportedVideoService;
//# sourceMappingURL=deleteExportedVideo.service.js.map