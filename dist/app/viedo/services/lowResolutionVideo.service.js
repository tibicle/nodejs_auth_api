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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const awsBatch_service_1 = __importDefault(require("../../../resources/awsBatch/awsBatch.service"));
const video_repo_1 = __importDefault(require("../repo/video.repo"));
let s3 = new aws_sdk_1.default.S3();
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : convert low resolution video service
🗓 @created : 17/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const convertLowResolutionVideoService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName } } = container;
        const lowResolutionVideo = yield awsBatch_service_1.default.convertVideoLowResolutionJob(container);
        if (lowResolutionVideo) {
            //
            //  prepare data model to save the aws batch job details
            //
            const jobDetailsDataModel = {
                job_id: lowResolutionVideo.jobId,
                file_uuid: fileDetails.uuid,
                status: constant_1.default.job_status.IN_PROCESS,
                name: container.derived.convertVideoKey,
                type: 'CONVERTVIDEO',
                user_uuid: logged_in_user.uuid,
                company_uuid: body.company_uuid ? body.company_uuid : null,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = convertLowResolutionVideoService;
//# sourceMappingURL=lowResolutionVideo.service.js.map