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
const constant_1 = __importDefault(require("../../config/constant"));
// Import Repos
const file_repo_1 = __importDefault(require("../../app/file/repo/file.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
const socketlib_1 = __importDefault(require("../../library/socketlib"));
// Configure AWS S3
const s3 = new aws_sdk_1.default.S3({
    region: `${constant_1.default.app.AWS_BUCKET_REGION}`,
    accessKeyId: `${constant_1.default.app.AWS_ACCESS_KEY}`,
    secretAccessKey: `${constant_1.default.app.AWS_SECRET_ACCESS_KEY}`, // Replace with your Secret Access Key
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : save file details
🗓 @created : 19/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveLowResolutionVideoConvert = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  update low resolution file data in table
        //
        yield updateLowResolutionFile(jobData);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : download video from s3 bucket
🗓 @created : 17/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLowResolutionFile = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    let lowResFileData;
    try {
        try {
            const fileName = jobData.name.split('/').pop();
            //
            //  low resolution video entry in database model
            //
            const lowResolutionVideoModel = {
                file_uuid: jobData.file_uuid,
                name: fileName,
                status: constant_1.default.file.status.COMPLETED,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save data
            //
            lowResFileData = yield file_repo_1.default.saveLowResolutionFileData(lowResolutionVideoModel);
            //
            //  update status of file
            //
            const fileModel = {
                status: constant_1.default.file.status.COMPLETED,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield file_repo_1.default.updateFiledata(jobData.file_uuid, fileModel);
            //
            //  prepare data model to save the aws bact job details
            //
            const jobDetailsDataModel = {
                status: constant_1.default.job_status.COMPLETED,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, jobDetailsDataModel);
            //
            //  emit socket
            //
            yield socketlib_1.default.sendLowResFileUuid(jobData);
        }
        catch (error) {
            console.log('Error processing video:', error.message);
            //
            //  error log database model
            //
            const lowResolutionVideoModel = {
                status: constant_1.default.file.status.FAILED,
                error_log: JSON.stringify(error.message),
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  update data
            //
            yield file_repo_1.default.updateLowResolutionFileData(lowResFileData.uuid, lowResolutionVideoModel);
            //
            //  update status of file
            //
            const fileModel = {
                status: constant_1.default.file.status.COMPLETED
            };
            yield file_repo_1.default.updateFiledata(jobData.file_uuid, fileModel);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveLowResolutionVideoConvert;
//# sourceMappingURL=awsVideoConvertLowResolution.service.js.map