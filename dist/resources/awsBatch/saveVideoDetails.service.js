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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
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
const saveVideoDetails = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  s3 params
        //
        const s3Params = { Bucket: constant_1.default.app.AWS_BUCKET_NAME, Key: `${jobData.name}` };
        const tempInputFile = path_1.default.join(__dirname, `../../../assets/videoDetailsFile/video_detials_${Date.now()}.json`);
        try {
            //
            //  download video from s3
            //
            const data = yield s3.getObject(s3Params).promise();
            //
            //  check directory exist or not
            //
            const dir = path_1.default.dirname(tempInputFile);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            //
            //  Save the file locally
            //
            fs_1.default.writeFileSync(tempInputFile, data.Body.toString());
            //
            // Get data from the JSON file
            //
            const videoFile = jobData.name.split('/').pop();
            // Read the file contents
            const fileContents = fs_1.default.readFileSync(tempInputFile, 'utf-8');
            // Parse the JSON
            const allVideoFile = JSON.parse(fileContents);
            //
            // file details
            //
            const fileDetails = yield file_repo_1.default.getFileByUuid(jobData.file_uuid);
            if (allVideoFile) {
                if (fileDetails.type === 'video') {
                    //
                    // Prepare data model to update video details
                    //
                    const updateVideoDetails = {
                        length: allVideoFile.format === 'N/A' ? null : allVideoFile.format.duration,
                        quality: allVideoFile.streams[0].width + 'x' + allVideoFile.streams[0].height,
                        aspect_ratio: allVideoFile.streams[0].display_aspect_ratio === 'N/A' ? null : allVideoFile.streams[0].display_aspect_ratio,
                        resolution_type: constant_1.default.resolution_type[allVideoFile.streams[0].width + 'x' + allVideoFile.streams[0].height],
                        size: allVideoFile.format.size === 'N/A' ? null : allVideoFile.format.size,
                    };
                    //
                    // Update file details
                    //
                    yield file_repo_1.default.updateFiledata(jobData.file_uuid, updateVideoDetails);
                }
                if (fileDetails.type == 'audio') {
                    //
                    //  prepare data model to update video details
                    //
                    const updateVideoDetails = {
                        length: allVideoFile.format.duration == 'N/A' ? null : allVideoFile.format.duration,
                        size: allVideoFile.format.size == 'N/A' ? null : allVideoFile.format.size
                    };
                    //
                    // update file details
                    //
                    yield file_repo_1.default.updateFiledata(jobData.file_uuid, updateVideoDetails);
                }
                if (fileDetails.type == 'image') {
                    //
                    //  prepare data model to update video details
                    //
                    const updateVideoDetails = {
                        // length: videoData.duration == 'N/A' ? null : videoData.duration ,
                        quality: allVideoFile.streams[0].width + 'x' + allVideoFile.streams[0].height,
                        // aspect_ratio: videoData.videoStream.display_aspect_ratio == 'N/A' ? null : videoData.videoStream.display_aspect_ratio,
                        resolution_type: constant_1.default.resolution_type[allVideoFile.streams[0].width + 'x' + allVideoFile.streams[0].height],
                        size: allVideoFile.format.size == 'N/A' ? null : allVideoFile.format.size
                    };
                    //
                    // update file details
                    //
                    yield file_repo_1.default.updateFiledata(jobData.file_uuid, updateVideoDetails);
                }
            }
            //
            //  Delete JSON file locally
            //
            if (fs_1.default.existsSync(tempInputFile)) {
                fs_1.default.unlinkSync(tempInputFile);
            }
            const s3DeleteParams = { Bucket: constant_1.default.app.AWS_BUCKET_NAME, Key: `${jobData.name}` };
            //
            // Cleanup: Delete JSON file from S3
            //
            yield s3.deleteObject(s3DeleteParams).promise();
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
        }
        catch (error) {
            console.error("Error listing files:", error);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveVideoDetails;
//# sourceMappingURL=saveVideoDetails.service.js.map