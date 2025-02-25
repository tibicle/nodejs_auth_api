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
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const awsBatch_service_1 = __importDefault(require("../../../resources/awsBatch/awsBatch.service"));
const video_repo_1 = __importDefault(require("../repo/video.repo"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Configure AWS S3
const s3 = new aws_sdk_1.default.S3({
    region: `${constant_1.default.app.AWS_BUCKET_REGION}`,
    accessKeyId: `${constant_1.default.app.AWS_ACCESS_KEY}`,
    secretAccessKey: `${constant_1.default.app.AWS_SECRET_ACCESS_KEY}`, // Replace with your Secret Access Key
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get the video details from aws batch job
🗓 @created : 19/04/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getVideoDetailsBatchJob = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName } } = container;
        const videoDetailsBatch = yield awsBatch_service_1.default.getVideoDetailsJob(container);
        if (videoDetailsBatch) {
            //
            //  prepare data model to save the aws bact job details
            //
            const jobDetailsDataModel = {
                job_id: videoDetailsBatch.jobId,
                file_uuid: fileDetails.uuid,
                status: constant_1.default.job_status.IN_PROCESS,
                name: container.derived.VideoDetailKey,
                type: 'JSON',
                user_uuid: logged_in_user.uuid,
                company_uuid: body.company_uuid ? body.company_uuid : null,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            container.derived.videoDetailsBatchUuid = yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
        }
        return container;
    }
    catch (error) {
        console.log("ERROR FROM SERVICE");
        console.log(error);
    }
});
exports.default = getVideoDetailsBatchJob;
//# sourceMappingURL=getVideoDetailsJob.service.js.map