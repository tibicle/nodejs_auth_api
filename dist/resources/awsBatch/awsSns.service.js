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
const i18n_1 = __importDefault(require("../../config/i18n"));
const constant_1 = __importDefault(require("../../config/constant"));
const saveThumbnailDetails_service_1 = __importDefault(require("./saveThumbnailDetails.service"));
const saveFrameDetails_service_1 = __importDefault(require("./saveFrameDetails.service"));
const saveAudioDetails_service_1 = __importDefault(require("./saveAudioDetails.service"));
const saveVideoDetails_service_1 = __importDefault(require("./saveVideoDetails.service"));
const updateExportStatusAfterJob_service_1 = __importDefault(require("./updateExportStatusAfterJob.service"));
// Import Transformers
// Import Libraries
// Import Repos
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fs1 = require('fs').promises;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: constant_1.default.app.AWS_BUCKET_REGION });
const https_1 = __importDefault(require("https"));
const response_helper_1 = __importDefault(require("../../helpers/response.helper"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
const awsVideoConvertLowResolution_service_1 = __importDefault(require("./awsVideoConvertLowResolution.service"));
const validateAllJobsStatus_service_1 = __importDefault(require("../../app/viedo/services/validateAllJobsStatus.service"));
const hlsVideoCreate_service_1 = __importDefault(require("../ffmpeg/hlsVideoCreate.service"));
const export_repo_1 = __importDefault(require("../../app/export/repo/export.repo"));
const calculateS3Usage_helper_1 = __importDefault(require("../../helpers/calculateS3Usage.helper"));
const calculateFolderSize_helper_1 = __importDefault(require("../../helpers/calculateFolderSize.helper"));
const updateProductionS3Usage_service_1 = __importDefault(require("../../app/export/services/updateProductionS3Usage.service"));
const errorLog_repo_1 = __importDefault(require("../../app/errorLog/repos/errorLog.repo"));
class AwsSnsController {
    getSnsNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        params: req.params,
                        logged_in_user: req.logged_in_user,
                        auth_token: req.auth_token,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  sns message read for notification
                //
                const messageType = req.headers['x-amz-sns-message-type'];
                if (messageType === 'SubscriptionConfirmation') {
                    try {
                        //
                        // Raw body
                        //
                        const rawBody = req['rawBody'];
                        if (!rawBody) {
                            console.error('Raw body not found.');
                        }
                        //
                        //  parse raw body
                        //
                        const snsMessage = JSON.parse(rawBody);
                        //
                        //  subscribe url
                        //
                        const subscribeUrl = snsMessage.SubscribeURL;
                        if (!subscribeUrl) {
                            console.error('SubscribeURL is undefined. Check SNS message format.');
                        }
                        // Send GET request to confirm the subscription
                        https_1.default.get(subscribeUrl, (response) => {
                            response.on('data', (d) => {
                                console.log(d.toString());
                            });
                        }).on('error', (err) => {
                            console.error('Error confirming subscription:', err.message);
                        });
                    }
                    catch (error) {
                        console.error('Error parsing SubscriptionConfirmation message:', error);
                    }
                }
                else if (messageType === 'Notification') {
                    try {
                        //
                        //  store data 
                        //
                        const rawBody = req['rawBody'];
                        if (!rawBody) {
                            console.error('Raw body not found.');
                        }
                        //
                        //  Parse the initial raw notification message
                        //
                        const notificationMessage = JSON.parse(rawBody);
                        if (notificationMessage) {
                            if (notificationMessage && notificationMessage.detail.status == 'SUCCEEDED') {
                                //  
                                //  get job details by job ID
                                //
                                const jobData = yield video_repo_1.default.getJobDetailsById(notificationMessage.detail.jobId);
                                if (jobData) {
                                    if (jobData.type == 'IMAGE') {
                                        //
                                        //  store thumbnail information
                                        //
                                        yield (0, saveThumbnailDetails_service_1.default)(jobData);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'FRAME') {
                                        //
                                        //  store frame details
                                        //
                                        yield (0, saveFrameDetails_service_1.default)(jobData);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'AUDIO') {
                                        //
                                        //  store frame details
                                        //
                                        yield (0, saveAudioDetails_service_1.default)(jobData);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'JSON') {
                                        //
                                        //  store thumbnail information
                                        //
                                        yield (0, saveVideoDetails_service_1.default)(jobData);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'CONVERTVIDEO') {
                                        //
                                        //  store thumbnail information
                                        //
                                        yield (0, awsVideoConvertLowResolution_service_1.default)(jobData);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'EXPORT_VIDEO') {
                                        let container = {
                                            input: {
                                                body: {
                                                    status: 'COMPLETED',
                                                    jobId: jobData.uuid,
                                                    company_uuid: jobData.company_uuid ? jobData.company_uuid : null,
                                                    user_uuid: jobData.user_uuid ? jobData.user_uuid : null
                                                },
                                                params: {
                                                    uuid: jobData.production_export_uuid
                                                },
                                                query: {
                                                    sequence_uuid: jobData.sequence_uuid
                                                }
                                            },
                                            derived: {}
                                        };
                                        //
                                        //  update export status
                                        //
                                        yield (0, updateExportStatusAfterJob_service_1.default)(container);
                                        const tempExportPath = jobData.name;
                                        const exportFolder = jobData.name.split('/').slice(0, -1).join('/');
                                        const tempExportFolder = `${exportFolder}/`;
                                        const tempExportUuid = jobData.production_export_uuid;
                                        yield (0, hlsVideoCreate_service_1.default)(tempExportPath, tempExportFolder, tempExportUuid);
                                        //
                                        //  get production details
                                        //
                                        const exportDetails = yield export_repo_1.default.checkExportFileByUuid(jobData.production_export_uuid);
                                        const productionDetails = {
                                            uuid: exportDetails.production_uuid,
                                        };
                                        //
                                        //  get production folder path
                                        //
                                        const productionFolderPath = yield calculateS3Usage_helper_1.default.getProductionFolderPath(jobData.company_uuid, jobData.user_uuid, productionDetails);
                                        //
                                        //  get the folder size of the file store while uploading production export video
                                        //
                                        const productionFolderSize = yield calculateFolderSize_helper_1.default.calculateSize(productionFolderPath);
                                        container = {
                                            input: {
                                                body: {
                                                    status: 'COMPLETED',
                                                    jobId: jobData.uuid,
                                                    company_uuid: jobData.company_uuid ? jobData.company_uuid : null,
                                                    user_uuid: jobData.user_uuid ? jobData.user_uuid : null
                                                },
                                                params: {
                                                    uuid: jobData.production_export_uuid
                                                },
                                                query: {
                                                    sequence_uuid: jobData.sequence_uuid
                                                }
                                            },
                                            derived: {
                                                productionDetails: {
                                                    uuid: exportDetails.production_uuid,
                                                },
                                                productionFolderSize: productionFolderSize
                                            }
                                        };
                                        yield (0, updateProductionS3Usage_service_1.default)(container);
                                    }
                                    if (jobData.type == 'EXPORT_THUMBNAIL_IMAGE') {
                                        //
                                        //  store export thumbnail information
                                        //
                                        yield (0, saveThumbnailDetails_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'EXPORT_VIDEO_JSON') {
                                        //
                                        //  store export video details
                                        //
                                        yield (0, saveVideoDetails_service_1.default)(jobData);
                                    }
                                }
                            }
                            if (notificationMessage && notificationMessage.detail.status == 'FAILED') {
                                //  
                                //  get job details by job ID
                                //
                                const jobData = yield video_repo_1.default.getJobDetailsById(notificationMessage.detail.jobId);
                                if (jobData) {
                                    if (jobData.type == 'IMAGE') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.LIBRARY,
                                            error_name: i18n_1.default.__('error_log.thumbnail_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'FRAME') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.LIBRARY,
                                            error_name: i18n_1.default.__('error_log.frame_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'AUDIO') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.LIBRARY,
                                            error_name: i18n_1.default.__('error_log.audio_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'JSON') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.LIBRARY,
                                            error_name: i18n_1.default.__('error_log.json_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'CONVERTVIDEO') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.LIBRARY,
                                            error_name: i18n_1.default.__('error_log.convert_video_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        //  check that all job is completed
                                        //
                                        yield (0, validateAllJobsStatus_service_1.default)(jobData);
                                    }
                                    if (jobData.type == 'EXPORT_VIDEO') {
                                        //
                                        //  update aws job status
                                        //
                                        const updateAwsJobStatusDataModel = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
                                        //
                                        //  prepare data model to save error log
                                        //
                                        const errorlogDataModel = {
                                            production_export_uuid: jobData.production_export_uuid ? jobData.production_export_uuid : null,
                                            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                            created_by: jobData.user_uuid,
                                            log_stream: notificationMessage.detail.container.logStreamName,
                                            type: constant_1.default.error_log_type.PRODUCTION,
                                            error_name: i18n_1.default.__('error_log.export_error')
                                        };
                                        yield errorLog_repo_1.default.saveLogDetails(errorlogDataModel);
                                        //
                                        // prepare data model to update export status
                                        //
                                        const updateExportStatus = {
                                            status: constant_1.default.job_status.FAILED,
                                            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                                        };
                                        yield export_repo_1.default.updateExportFileStatus(jobData.production_export_uuid, updateExportStatus);
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        console.error('Error parsing Notification message:', error);
                    }
                }
                else {
                    console.error('Unknown message type:', messageType);
                }
                //
                // send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new AwsSnsController();
//# sourceMappingURL=awsSns.service.js.map