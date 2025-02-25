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
const constant_1 = __importDefault(require("../../../config/constant"));
const awsBatch_service_1 = __importDefault(require("../../../resources/awsBatch/awsBatch.service"));
// Import Helpers
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const video_repo_1 = __importDefault(require("../repo/video.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create thumbnai image service
🗓 @created : 13/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createThumbnailImageService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { files, fileDetails } } = container;
        container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, logged_in_user.uuid, container.derived.fileDetails.name);
        //
        //  create thumbnail image from video file
        //
        yield createThumbnailImage(container);
        //
        //  save file details 
        //
        // await saveFileDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create thumbnail image from video file
🗓 @created : 12/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createThumbnailImage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName } } = container;
        //
        //  update status of file
        //
        const fileModel = {
            status: constant_1.default.file.status.PROCESSING
        };
        yield file_repo_1.default.updateFiledata(fileDetails.uuid, fileModel);
        // container.derived.image = await thumbnailService.createImage(`${fileName}/${fileDetails.name}`,fileDetails.uuid);
        // const thumbnailKey = 'thumbnail' + Date.now() + '.png';
        container.derived.thumbnailKey = 'thumbnail' + Date.now() + '.png';
        // const fileContent:any = fs.createReadStream(`${container.derived.image}`);
        // const thumbnailUploadParams = {
        //     Bucket: `${config.app.AWS_BUCKET_NAME}`,
        //     Key: `${fileName}/${thumbnailKey}`,
        //     Body: fileContent
        // };
        // const uploadThumbnail = await s3.upload(thumbnailUploadParams).promise();
        // if(uploadThumbnail){
        //     fs.unlinkSync(`${container.derived.image}`);
        // }
        // container.derived.image = thumbnailKey
        // return container;
        const thumbnailBatch = yield awsBatch_service_1.default.createThumbnailJob(container);
        if (thumbnailBatch) {
            //
            //  prepare data model to save the aws bact job details
            //
            const jobDetailsDataModel = {
                job_id: thumbnailBatch.jobId,
                file_uuid: fileDetails.uuid,
                status: constant_1.default.job_status.IN_PROCESS,
                name: container.derived.thumbnailKey,
                type: 'IMAGE',
                user_uuid: logged_in_user.uuid,
                company_uuid: body.company_uuid ? body.company_uuid : null,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
        }
    }
    catch (error) {
        console.log(JSON.stringify(error));
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save file details
🗓 @created : 10/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, audio, image, updatedTag } } = container;
        //
        //  prepare data model to update file data
        //
        const updateFileData = {
            thumbnail_file_name: image
        };
        yield file_repo_1.default.updateFiledata(fileDetails.uuid, updateFileData);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createThumbnailImageService;
//# sourceMappingURL=createThumbnailImage.service.js.map