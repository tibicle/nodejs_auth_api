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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const createHlsVideoApi_service_1 = __importDefault(require("../../../resources/ffmpeg/createHlsVideoApi.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create hls video
🗓 @created : 05/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createHlsVideoService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        let fileFolder;
        let folderPath;
        //
        //  export details
        //
        const exportDetails = yield export_repo_1.default.getExportVideoDetailsByUuid(body.export_uuid);
        //
        //  add check that if status is failed then create
        //
        if (exportDetails.hls_status !== 'FAILED' && exportDetails.hls_status !== null) {
            const err = new Error(i18n_1.default.__('export.not_generate_hls'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  update all required columns to create hls video to null
        //
        const hlsUpdateModel = {
            embed_code: null,
            embed_thumbnail: null,
            embed_hls_file_name: null,
            hls_jobid: null,
            hls_error: null,
            hls_status: 'IN_PROGRESS'
        };
        yield export_repo_1.default.updateExportDetails(exportDetails.uuid, hlsUpdateModel);
        if (exportDetails.production_company) {
            const productionDetails = {
                name: exportDetails.production_name,
                uuid: exportDetails.production_uuid
            };
            //
            //  get the folder with file
            //
            fileFolder = yield s3Folder_helper_1.default.getProductionFolderPath(exportDetails.production_company, null, exportDetails.file_name, productionDetails);
            //
            //  get the folder
            //
            folderPath = yield s3Folder_helper_1.default.getProductionFolderPath(exportDetails.production_company, null, "", productionDetails);
        }
        else if (exportDetails.production_user) {
            const productionDetails = {
                name: exportDetails.production_name,
                uuid: exportDetails.production_uuid
            };
            //
            //  get the folder
            //
            fileFolder = yield s3Folder_helper_1.default.getProductionFolderPath(null, exportDetails.production_user, exportDetails.file_name, productionDetails);
            //
            //  get the folder
            //
            folderPath = yield s3Folder_helper_1.default.getProductionFolderPath(null, exportDetails.production_user, "", productionDetails);
        }
        //
        //  set response to create hls video
        //
        const responseResult = {
            exportPath: fileFolder,
            exportFolder: folderPath,
            exportUuid: exportDetails.uuid
        };
        container.output.message = i18n_1.default.__('export.hls_create_success');
        container.output.result = responseResult;
        //
        //  hls video create api service
        //
        yield (0, createHlsVideoApi_service_1.default)(fileFolder, folderPath, exportDetails.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createHlsVideoService;
//# sourceMappingURL=createHlsVideo.service.js.map