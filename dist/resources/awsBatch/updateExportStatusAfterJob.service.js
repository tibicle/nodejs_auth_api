"use strict";
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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
const email_helper_1 = __importDefault(require("../../helpers/email.helper"));
// Import validations
// Import Transformers
// Import Libraries
const sendEmail_1 = __importDefault(require("../../library/sendEmail"));
// Import Models
const export_repo_1 = __importDefault(require("../../app/export/repo/export.repo"));
const user_repo_1 = __importDefault(require("../../app/user/repos/user.repo"));
const file_repo_1 = __importDefault(require("../../app/file/repo/file.repo"));
const production_repo_1 = __importDefault(require("../../app/production/repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// import exportError from "./exportErrorLogs.service";
const s3Folder_helper_1 = __importDefault(require("../../helpers/s3Folder.helper"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
const awsBatch_service_1 = __importDefault(require("./awsBatch.service"));
// import videoInfoService from "../../../resources/ffmpeg/videoInfo.service";
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update export file status service after job success
🗓 @created : 31/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportStatusAfterJob = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, derived: {} } = container;
        //
        //  check export file exists or not
        //
        yield export_repo_1.default.checkExportFileByUuid(params.uuid);
        //
        //  update export file status
        //
        yield updateExportFileStatus(container);
        if (body.status == 'COMPLETED') {
            //
            //  get production export details by production export uuid
            //
            container.derived.productionExportDetails = yield export_repo_1.default.getExportFileByUuid(params.uuid, query.sequence_uuid);
            //
            //  get user email who exported the video
            //
            const user = yield user_repo_1.default.getUserByUuid(container.derived.productionExportDetails.created_by.uuid);
            //
            //  get file details by uuid
            //
            container.derived.fileDetails = yield file_repo_1.default.getFileByUuid(container.derived.productionExportDetails.file_uuid);
            //
            //  get production details
            //
            container.derived.productionDetails = yield production_repo_1.default.checkProductionByUuid(container.derived.productionExportDetails.production_uuid);
            //
            //  get the file path
            //
            const fileUrl = yield s3Folder_helper_1.default.getProductionFolderPath(container.derived.productionDetails.company_uuid, container.derived.productionExportDetails.created_by.uuid, container.derived.fileDetails.name, container.derived.productionDetails);
            container.derived.extractedURL = fileUrl.replace(`/${container.derived.fileDetails.name}`, "");
            if (user.language == constant_1.default.user_language.ENGLISH) {
                const message = {
                    to: [{ email: user.email }],
                    sender: { email: constant_1.default.app.FROM_EMAIL },
                    subject: i18n_1.default.__('email_templates.video_exported'),
                    head_text: i18n_1.default.__('export_video.head_text'),
                    para_text: i18n_1.default.__('export_video.para_text'),
                    button_text: i18n_1.default.__('export_video.button_text'),
                    para_second_text: i18n_1.default.__('export_video.para_second_text'),
                    query_text: i18n_1.default.__('export_video.query_text'),
                    logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                    top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                    bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                    google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                    facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                    linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                    twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                    message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                    font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                    redirect_uri: `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}`,
                    htmlContent: ""
                };
                message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.EXPORT_VIDEO, message);
                yield (0, sendEmail_1.default)(message);
            }
            else {
                const message = {
                    to: [{ email: user.email }],
                    sender: { email: constant_1.default.app.FROM_EMAIL },
                    subject: i18n_1.default.__('email_templates.video_exported_dutch'),
                    head_text: i18n_1.default.__('export_video.head_text_dutch'),
                    para_text: i18n_1.default.__('export_video.para_text_dutch'),
                    button_text: i18n_1.default.__('export_video.button_text_dutch'),
                    para_second_text: i18n_1.default.__('export_video.para_second_text_dutch'),
                    query_text: i18n_1.default.__('export_video.query_text_dutch'),
                    logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                    top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                    bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                    google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                    facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                    linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                    twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                    message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                    font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                    redirect_uri: `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}`,
                    htmlContent: ""
                };
                message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.EXPORT_VIDEO, message);
                yield (0, sendEmail_1.default)(message);
            }
            //
            //  extract thumbnail from exported video
            //
            yield createThumbnailImage(container);
            //
            //  get extracted video info
            //
            yield getVideoDetails(container);
            //
            // update the Sequence as mark exported
            //
            yield updateSequenceStatus(container);
        }
        //
        //  update aws job status
        //
        const updateAwsJobStatusDataModel = {
            status: constant_1.default.job_status.COMPLETED,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        yield video_repo_1.default.updateAwsJobStatus(body.jobId, updateAwsJobStatusDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update the export file status
🗓 @created : 01/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportFileStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { productionExportDetails } } = container;
        //
        // prepare data model to update export file status
        //
        const updateExportStatusDataModel = {
            status: body.status,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        if (body.status == "EXPORTING") {
            //
            // prepare data model to update export file status
            //
            updateExportStatusDataModel.start_time = moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss');
        }
        else {
            //
            // prepare data model to update export file status
            //
            updateExportStatusDataModel.end_time = moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss');
        }
        //
        //  update export status
        //
        yield export_repo_1.default.updateExportFileStatus(params.uuid, updateExportStatusDataModel);
        //
        //  get export details
        //
        const exportDetails = yield export_repo_1.default.checkExportFileByUuid(params.uuid);
        if (exportDetails.start_time && exportDetails.end_time) {
            const startTime = new Date(exportDetails.start_time);
            const endTime = new Date(exportDetails.end_time);
            //
            //  get time difference into millisecond
            //  
            const timeDifferenceMs = endTime - startTime;
            //
            // Convert milliseconds to minutes
            //
            const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);
            //
            //  prepare data model to update total time
            //
            const updateTotalTime = {
                total_time: Math.round(timeDifferenceMinutes + 0.5)
            };
            //
            //  update data into production export 
            //
            yield export_repo_1.default.updateExportDetails(params.uuid, updateTotalTime);
        }
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
        const { input: { body, params, logged_in_user }, derived: { fileDetails, extractedURL } } = container;
        container.derived.fileName = extractedURL;
        //
        //  update status of file
        //
        const fileModel = {
            status: constant_1.default.file.status.PROCESSING
        };
        yield file_repo_1.default.updateFiledata(fileDetails.uuid, fileModel);
        container.derived.thumbnailKey = 'thumbnail' + Date.now() + '.png';
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
                type: 'EXPORT_THUMBNAIL_IMAGE',
                user_uuid: body.user_uuid ? body.user_uuid : null,
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
const getVideoDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, extractedURL } } = container;
        container.derived.fileName = extractedURL;
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
                type: 'EXPORT_VIDEO_JSON',
                user_uuid: body.user_uuid ? body.user_uuid : null,
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
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update sequence status
🗓 @created : 05/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateSequenceStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  update the sequence status to exported
        //
        const updateSequenceDataModel = {
            status: 'EXPORTED',
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_by: container.derived.productionExportDetails.created_by.uuid
        };
        //
        //  update sequence data
        //
        yield production_repo_1.default.updateSequence(query.sequence_uuid, updateSequenceDataModel);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = updateExportStatusAfterJob;
//# sourceMappingURL=updateExportStatusAfterJob.service.js.map