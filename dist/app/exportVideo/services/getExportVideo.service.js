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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
const aws_1 = __importDefault(require("../../../library/aws"));
// Import Repos
// Import Services
const getExportDetails_service_1 = __importDefault(require("../../export/services/getExportDetails.service"));
const getLayer_service_1 = __importDefault(require("../../production/service/getLayer.service"));
const updateExportStatus_service_1 = __importDefault(require("../../export/services/updateExportStatus.service"));
const export_service_1 = __importDefault(require("../../../resources/ffmpeg/export.service"));
const saveExportFileDetails_service_1 = __importDefault(require("../../file/services/saveExportFileDetails.service"));
// Import Thirdparty
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//  Variables used in project for HLS
var tempExportPath;
var tempExportFolder;
var tempExportUuid;
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : export video service
🗓 @created : 18/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const exportVideo = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const container = {
            input: {
                body: {},
                params: {
                    uuid: body.production_export_uuid,
                    production_uuid: body.production_uuid
                },
                query: {
                    sequence_uuid: body.sequence_uuid,
                    user_uuid: body.user_uuid,
                    company_uuid: body.company_uuid
                }
            },
            derived: {},
            output: {
                result: {}
            }
        };
        //
        //  get export details by export uuid
        //
        var exportDetails = yield (0, getExportDetails_service_1.default)(container);
        let mainQuality = exportDetails.output.result.quality;
        container.input.params.production_uuid = exportDetails.output.result.production_uuid;
        //
        //  get layer details
        //
        const layerDetails = yield (0, getLayer_service_1.default)(container);
        container.input.body.status = 'EXPORTING';
        //
        //  update status to exporting video
        //
        yield (0, updateExportStatus_service_1.default)(container);
        exportDetails = exportDetails.output.result[0];
        //
        //  create video segments to process the video
        //
        const videoSegments = yield export_service_1.default.createVideoSegments(layerDetails.output.result, exportDetails.uuid, mainQuality, exportDetails.sequence_uuid, body);
        //
        //  process the video and upload to s3
        //
        const uploadData = yield processVideo(videoSegments, exportDetails.uuid, mainQuality, exportDetails.sequence_uuid, body);
        //
        //  save video path from where we create hls video 
        //
        tempExportPath = uploadData && uploadData.Key ? uploadData.Key : uploadData.key;
        //
        //  save export uuid
        //
        tempExportUuid = exportDetails.uuid;
        const key = tempExportPath.split('/');
        container.input.body.name = key[key.length - 1];
        container.input.body.url = uploadData.Location;
        container.input.body.production_uuid = body.production_export_uuid;
        //
        //  save file into file table
        //
        yield (0, saveExportFileDetails_service_1.default)(container);
        //
        // Delete font file after use
        //
        yield deleteFilesWithSuffix(exportDetails.sequence_uuid);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : process the video
🗓 @created : 18/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const processVideo = (videoSegments, productionExportUuid, quality, sequenceUuid, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (body.company_uuid) {
            const bucketName = `${process.env.AWS_BUCKET_NAME}`;
            var companyUuid = body.company_uuid.replace(/-/g, '_');
            var companyName = constant_1.default.folder_prefix.COMPANY;
            const companyFolder = `${companyName}_${companyUuid}/`;
            //
            //  create folder with organization name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, companyFolder);
            //
            //  create production folder inside company folder if not exists
            //
            const production = constant_1.default.folder.PRODUCTION;
            //
            //  check production folder exists or not
            //
            const checkProductionFolder = `${companyFolder}${production}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, checkProductionFolder);
            const productionUuid = body.production_uuid.replace(/-/g, '_');
            var productionName = constant_1.default.folder_prefix.PRODUCTION;
            const productionFolder = `${productionName}_${productionUuid}/`;
            const createFolder = `${checkProductionFolder}${productionFolder}`;
            yield aws_1.default.checkAndCreateFolder(bucketName, createFolder);
            //
            //  create export folder
            //
            const exportData = constant_1.default.folder.EXPORT;
            const exportFolder = `${createFolder}${exportData}/`;
            var uploadKey = yield aws_1.default.checkAndCreateFolder(bucketName, exportFolder);
            //
            //  store folder where export video is created for HLS
            //
            tempExportFolder = exportFolder;
        }
        else {
            const bucketName = `${process.env.AWS_BUCKET_NAME}`;
            const userUuid = body.user_uuid.replace(/-/g, '_');
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            //
            //  create folder with self name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, selfFolder);
            //
            //  create production folder inside company folder if not exists
            //
            const production = constant_1.default.folder.PRODUCTION;
            //
            //  check production folder exists or not
            //
            const checkProductionFolder = `${selfFolder}${production}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, checkProductionFolder);
            const productionUuid = body.production_uuid.replace(/-/g, '_');
            var productionName = constant_1.default.folder_prefix.PRODUCTION;
            const productionFolder = `${productionName}_${productionUuid}/`;
            const createFolder = `${checkProductionFolder}${productionFolder}`;
            yield aws_1.default.checkAndCreateFolder(bucketName, createFolder);
            //
            //  create export folder
            //
            const exportData = constant_1.default.folder.EXPORT;
            const exportFolder = `${createFolder}${exportData}/`;
            var uploadKey = yield aws_1.default.checkAndCreateFolder(bucketName, exportFolder);
            //
            //  store folder where export video is created for HLS
            //
            tempExportFolder = exportFolder;
        }
        //
        //  initiate s3 upload process
        //
        const s3ObjectKey = `${uploadKey}export_${Date.now()}.mp4`;
        //
        //  create array to generate export video command 
        //
        const createCommand = yield export_service_1.default.createCommandArray(videoSegments, productionExportUuid, quality, sequenceUuid, s3ObjectKey, body);
        const data = {
            key: s3ObjectKey
        };
        return data;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete font file which is used while generating video
🗓 @created : 29/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteFilesWithSuffix = (suffix) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directoryPath = path_1.default.join(__dirname, '../../../../assets/fonts');
        // console.log(`Directory path resolved to: ${directoryPath}`);
        // Check if the directory exists
        if (!fs_1.default.existsSync(directoryPath)) {
            console.error(`Directory does not exist: ${directoryPath}`);
            return;
        }
        const files = yield fs_1.default.promises.readdir(directoryPath);
        for (const file of files) {
            // Check if the file name includes the suffix
            if (file.includes(suffix)) {
                const filePath = path_1.default.join(directoryPath, file);
                yield fs_1.default.promises.unlink(filePath);
                // console.log(`Deleted file with suffix '${suffix}': ${filePath}`);
            }
        }
        // console.log(`All files with suffix '${suffix}' deleted from directory: ${directoryPath}`);
    }
    catch (error) {
        console.error(`Error deleting directory: ${error.message}`);
    }
});
exports.default = exportVideo;
//# sourceMappingURL=getExportVideo.service.js.map