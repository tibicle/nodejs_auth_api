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
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
const covertBytesToSize_helper_1 = __importDefault(require("../../../helpers/covertBytesToSize.helper"));
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save export file details media
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getExportDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check export file exists or not
        //
        const exportDetail = yield export_repo_1.default.checkExportFileByUuid(params.uuid);
        if (query.sequence_uuid) {
            console.log("query.sew");
            console.log(query.sequence_uuid);
            //
            //  get the export file details
            //
            container.output.result = yield export_repo_1.default.getExportFileByUuid(params.uuid, query.sequence_uuid);
            console.log("container.output.result", container.output.result);
        }
        else {
            const exportDetails = yield export_repo_1.default.getExportVideoDetailsByUuid(params.uuid);
            if (container.input.query.company_uuid) {
                const productionDetails = {
                    name: exportDetails.production_name,
                    uuid: exportDetails.production_uuid
                };
                //
                //  get the folder
                //
                var folder = yield s3Folder_helper_1.default.getProductionFolderPath(container.input.query.company_uuid, logged_in_user.uuid, exportDetails.file_name, productionDetails);
                var folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(container.input.query.company_uuid, logged_in_user.uuid, exportDetails.thumbnail_file_name, productionDetails);
            }
            else {
                const productionDetails = {
                    name: exportDetails.production_name,
                    uuid: exportDetails.production_uuid
                };
                //
                //  get the folder
                //
                var folder = yield s3Folder_helper_1.default.getProductionFolderPath(container.input.query.company_uuid, logged_in_user.uuid, exportDetails.file_name, productionDetails);
                var folderThumbnail = yield s3Folder_helper_1.default.getProductionFolderPath(container.input.query.company_uuid, logged_in_user.uuid, exportDetails.thumbnail_file_name, productionDetails);
            }
            exportDetails.file_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folder}`;
            if (exportDetails.thumbnail_file_name != null) {
                exportDetails.thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}/${folderThumbnail}`;
            }
            else {
                exportDetails.thumbnail_url = null;
            }
            exportDetails.server_link = constant_1.default.app.HLS_SERVER_URL;
            if (exportDetails.embed_thumbnail) {
                //
                //  get file by uuid
                //
                var fileDetails = yield file_repo_1.default.getFileByUuid(exportDetails.embed_thumbnail);
                const s3Url = fileDetails.aws_s3_url;
                const cloudfrontBaseUrl = constant_1.default.app.CLOUDFRONT_URL;
                var updatedUrl = s3Url.split('/').slice(3).join('/');
                //
                //  send embed video thumbnail in response.
                //
                exportDetails.embed_thumbnail = `${constant_1.default.app.CLOUDFRONT_URL}/${updatedUrl}`;
            }
            else {
                exportDetails.embed_thumbnail = null;
            }
            //
            //  Send hls status in response
            //
            if (exportDetails) {
                exportDetails.is_hls_created = exportDetails.hls_status;
            }
            if (exportDetails && exportDetails.size) {
                const size = yield covertBytesToSize_helper_1.default.convertBytes(exportDetails.size);
                exportDetails.size = size;
            }
            container.output.result = exportDetails;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getExportDetails;
//# sourceMappingURL=getExportDetails.service.js.map