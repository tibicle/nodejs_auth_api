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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
// Import validations
// Import Transformers
// Import Libraries
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
// Import Models
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const exportErrorLogs_service_1 = __importDefault(require("./exportErrorLogs.service"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const thumbnail_service_1 = __importDefault(require("../../../resources/ffmpeg/thumbnail.service"));
const awsS3_1 = __importDefault(require("../../../config/awsS3"));
const fs_1 = __importDefault(require("fs"));
const videoInfo_service_1 = __importDefault(require("../../../resources/ffmpeg/videoInfo.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update export file status service
🗓 @created : 01/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
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
            const fileDetails = yield file_repo_1.default.getFileByUuid(container.derived.productionExportDetails.file_uuid);
            //
            //  get production details
            //
            const productionDetails = yield production_repo_1.default.checkProductionByUuid(container.derived.productionExportDetails.production_uuid);
            //
            //  get the file path
            //
            const fileUrl = yield s3Folder_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, container.derived.productionExportDetails.created_by.uuid, fileDetails.name, productionDetails);
            const extractedURL = fileUrl.replace(`/${fileDetails.name}`, "");
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
            yield createThumbnailImage(fileUrl, container.derived.productionExportDetails.file_uuid, extractedURL);
            //
            //  get extracted video info
            //
            yield getVideoDetails(fileUrl, container.derived.productionExportDetails.file_uuid);
            //
            // update the Sequence as mark exported
            //
            yield updateSequenceStatus(container);
        }
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('export.status_update');
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
        if (body.status == 'FAILED') {
            yield (0, exportErrorLogs_service_1.default)(params.uuid, body.err);
            //
            //  prepare data model to save the error log status
            //
            const saveErrorLofStatusDataModel = {
                production_export_uuid: params.uuid,
                status: constant_1.default.error_log_status.OPEN,
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                created_by: productionExportDetails.created_by
            };
            //
            //  save error log status
            //
            yield export_repo_1.default.saveErrorLogStatus(saveErrorLofStatusDataModel);
        }
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
const createThumbnailImage = (fileName, fileUuid, extractedURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield thumbnail_service_1.default.createImage(fileName, fileUuid);
        const thumbnailKey = 'thumbnail' + Date.now() + '.png';
        const fileContent = fs_1.default.createReadStream(`${image}`);
        const thumbnailUploadParams = {
            Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
            Key: `${extractedURL}/${thumbnailKey}`,
            Body: fileContent
        };
        const uploadThumbnail = yield awsS3_1.default.upload(thumbnailUploadParams).promise();
        if (uploadThumbnail) {
            fs_1.default.unlinkSync(`${image}`);
        }
        const imageKey = thumbnailKey;
        //
        //  prepare data model to update video details
        //
        const updateVideoDetails = {
            thumbnail_file_name: imageKey
        };
        //
        // update file details
        //
        yield file_repo_1.default.updateFiledata(fileUuid, updateVideoDetails);
        return imageKey;
    }
    catch (error) {
        console.log(JSON.stringify(error));
    }
});
const getVideoDetails = (fileName, fileUuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileDetails = yield file_repo_1.default.getFileByUuid(fileUuid);
        const videoData = yield videoInfo_service_1.default.extractFileInfo(`${fileName}`);
        if (videoData) {
            //
            //  prepare data model to update video details
            //
            const updateVideoDetails = {
                length: videoData.duration == 'N/A' ? null : videoData.duration,
                quality: videoData.videoStream.width + 'x' + videoData.videoStream.height,
                aspect_ratio: videoData.videoStream.display_aspect_ratio == 'N/A' ? null : videoData.videoStream.display_aspect_ratio,
                resolution_type: constant_1.default.resolution_type[videoData.videoStream.width + 'x' + videoData.videoStream.height],
                size: videoData.size == 'N/A' ? null : videoData.size
            };
            //
            // update file details
            //
            yield file_repo_1.default.updateFiledata(fileUuid, updateVideoDetails);
        }
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
exports.default = updateExportStatus;
//# sourceMappingURL=updateExportStatus.service.js.map