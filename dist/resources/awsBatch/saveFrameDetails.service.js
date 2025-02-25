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
// import s3 from "../../config/clientS3";
// const AWS = require('aws-sdk');
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Configure AWS S3
const s3 = new aws_sdk_1.default.S3({
    region: `${constant_1.default.app.AWS_BUCKET_REGION}`,
    accessKeyId: `${constant_1.default.app.AWS_ACCESS_KEY}`,
    secretAccessKey: `${constant_1.default.app.AWS_SECRET_ACCESS_KEY}`, // Replace with your Secret Access Key
});
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save frame details
🗓 @created : 19/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFrameDetails = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: constant_1.default.app.AWS_BUCKET_NAME,
            Prefix: `${jobData.name}`, // The folder path you want to list
        };
        try {
            const data = yield s3.listObjectsV2(params).promise();
            const files = data.Contents.map((file) => file.Key);
            // console.log("Files in folder:", files);
            if (files && files.length > 0) {
                //
                //  store frames into DB
                //
                const saveFrameModel = {
                    file_uuid: jobData.file_uuid,
                    frame: files,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
                //
                //  save the video frames
                //
                yield video_repo_1.default.saveFrame(saveFrameModel);
            }
            //
            //  update aws job status
            //
            const updateAwsJobStatusDataModel = {
                status: constant_1.default.job_status.COMPLETED,
                updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
            };
            yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
            // return files;
        }
        catch (error) {
            console.error("Error listing files:", error);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveFrameDetails;
//# sourceMappingURL=saveFrameDetails.service.js.map