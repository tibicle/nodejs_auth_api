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
const constant_1 = __importDefault(require("../../config/constant"));
const fs1 = require('fs').promises;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: constant_1.default.app.AWS_BUCKET_REGION });
class AwsBatchController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create thumbnail job
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createThumbnailJob(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user }, derived: { fileDetails, fileName, thumbnailKey } } = container;
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Input file
                //
                const inputKey = `${fileName}/${fileDetails.name}`;
                //
                //  Prepare paths for AWS Batch
                //
                const inputVideoS3Path = `s3://${bucketName}/${inputKey}`;
                // const inputVideoS3Path = `${signedUrl}`;
                const outputFolderS3Path = `s3://${bucketName}/${fileName}/${thumbnailKey}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_THUMBNAIL_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_THUMBNAIL_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `thumbnail-job-${fileDetails.uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        environment: [
                            { name: 'INPUT_VIDEO', value: inputVideoS3Path },
                            { name: 'OUTPUT_FOLDER', value: outputFolderS3Path }
                        ]
                    }
                };
                try {
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                    console.log("Error submitting AWS Batch job:", error);
                }
            }
            catch (error) {
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create frame generation job
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateFrameJob(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user }, derived: { fileDetails, fileName, thumbnailKey, inputVideoUrl, outputVideoUrl, timeStamp } } = container;
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Input file
                //
                const inputKey = `${inputVideoUrl}`;
                //
                //  Prepare paths for AWS Batch
                //
                const inputVideoS3Path = `s3://${bucketName}/${inputKey}`;
                const outputFolderS3Path = `s3://${bucketName}/${outputVideoUrl}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_FRAME_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_FRAME_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `frame-generation-job-${fileDetails.uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        environment: [
                            { name: 'INPUT_VIDEO_PATH', value: inputVideoS3Path },
                            { name: 'OUTPUT_S3_PATH', value: outputFolderS3Path },
                            { name: 'FPS', value: '1/6.4' },
                            { name: 'THUMBNAIL_SIZE', value: '50X50' },
                            { name: 'DYNAMIC_TIMESTAMP', value: `${timeStamp}` }
                        ]
                    }
                };
                try {
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                    console.log("Error submitting AWS Batch job:", error);
                }
            }
            catch (error) {
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create audio job
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createAudioJob(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user }, derived: { fileDetails, fileName, audioKey } } = container;
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Input file
                //
                const inputKey = `${fileName}/${fileDetails.name}`;
                //
                //  Prepare paths for AWS Batch
                //
                const inputVideoS3Path = `s3://${bucketName}/${inputKey}`;
                const outputFolderS3Path = `s3://${bucketName}/${fileName}/${audioKey}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_AUDIO_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_AUDIO_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `audio-job-${fileDetails.uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        environment: [
                            { name: 'INPUT_FILE', value: inputVideoS3Path },
                            { name: 'OUTPUT_FOLDER', value: outputFolderS3Path }
                        ]
                    }
                };
                try {
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                    console.log("Error submitting AWS Batch job:", error);
                }
            }
            catch (error) {
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get video details
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideoDetailsJob(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user }, derived: { fileDetails, fileName } } = container;
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Input file
                //
                const inputKey = `${fileName}/${fileDetails.name}`;
                //
                //  Prepare paths for AWS Batch
                //
                const inputVideoS3Path = `s3://${bucketName}/${inputKey}`;
                const VideoDetail = `temp_video_detail_${Date.now()}.json`;
                const outputFolderS3Path = `s3://${bucketName}/${fileName}/${VideoDetail}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_VIDEO_DETAILS_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_VIDEO_DETAILS_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `video-details-job-${fileDetails.uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        environment: [
                            { name: 'INPUT_FILE', value: inputVideoS3Path },
                            { name: 'OUTPUT_FOLDER', value: outputFolderS3Path }
                        ]
                    }
                };
                try {
                    container.derived.VideoDetailKey = `${fileName}/${VideoDetail}`;
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get video details
   🗓 @created : 19/12/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    convertVideoLowResolutionJob(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user }, derived: { fileDetails, fileName } } = container;
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Input file
                //
                const inputKey = `${fileName}/${fileDetails.name}`;
                //
                //  Prepare paths for AWS Batch
                //
                const inputVideoS3Path = `s3://${bucketName}/${inputKey}`;
                // const inputVideoS3Path = `${signedUrl}`;
                const VideoConvert = `temp_convert_video_${Date.now()}.mp4`;
                const outputFolderS3Path = `s3://${bucketName}/${fileName}/${VideoConvert}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_VIDEO_CONVERT_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_VIDEO_CONVERT_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `video-convert-job-${fileDetails.uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        environment: [
                            { name: 'INPUT_FILE', value: inputVideoS3Path },
                            { name: 'OUTPUT_FOLDER', value: outputFolderS3Path }
                        ]
                    }
                };
                try {
                    container.derived.convertVideoKey = `${fileName}/${VideoConvert}`;
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                    console.log("error in convert", error);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : export video via job
    🗓 @created : 31/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    exportVideoViaJob(jobCommand, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                //  AWS batch call
                //
                const batch = new aws_sdk_1.default.Batch();
                //
                //  AWS bucket name
                //
                const bucketName = `${constant_1.default.app.AWS_BUCKET_NAME}`;
                //
                //  Aws batch job definition and job Queue name
                //            
                const jobDefinition = constant_1.default.app.AWS_EXPORT_DEFINITION;
                const jobQueue = constant_1.default.app.AWS_EXPORT_QUEUE;
                //
                //  Params required to create aws batch job
                //
                const params = {
                    jobName: `export-job-${body.production_export_uuid}`,
                    jobQueue,
                    jobDefinition,
                    containerOverrides: {
                        command: [
                            "sh",
                            "-c",
                            jobCommand // Pass the command here
                        ]
                    }
                };
                try {
                    //
                    //  Submit AWS Batch job
                    //
                    const batchResponse = yield batch.submitJob(params).promise();
                    return batchResponse;
                }
                catch (error) {
                    console.log("error in convert", error);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new AwsBatchController();
//# sourceMappingURL=awsBatch.service.js.map