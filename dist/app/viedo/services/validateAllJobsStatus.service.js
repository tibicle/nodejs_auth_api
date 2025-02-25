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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
const aws_1 = __importDefault(require("../../../library/aws"));
// Import Repos
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const socketlib_1 = __importDefault(require("../../../library/socketlib"));
const video_repo_1 = __importDefault(require("../repo/video.repo"));
const email_helper_1 = __importDefault(require("../../../helpers/email.helper"));
const sendEmail_1 = __importDefault(require("../../../library/sendEmail"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
let s3 = new aws_sdk_1.default.S3();
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : convert low resolution video service
🗓 @created : 17/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateJobStatus = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  get job status based on file uuid
        //
        const jobStatus = yield video_repo_1.default.checkAwsBatchJobStatus(jobData.file_uuid);
        if (jobStatus && (jobStatus.type == 'FRAME' || jobStatus.type == 'CONVERTVIDEO' || jobStatus.type == 'JSON')) {
            const modifiedPath = jobData.name.split('/').slice(0, -1).join('/') + '/';
            const folderExists = yield aws_1.default.doesFolderExist(`${constant_1.default.app.AWS_BUCKET_NAME}`, modifiedPath);
            if (folderExists) {
                //
                //  del from s3
                //
                yield aws_1.default.deleteFolder(`${constant_1.default.app.AWS_BUCKET_NAME}`, modifiedPath);
            }
            //
            //  delete all the jobs
            //
            yield video_repo_1.default.deleteAwsBatchJobs(jobData.file_uuid);
            //
            //  delete the file Uuid
            //
            yield file_repo_1.default.deleteFileByuuid(jobData.file_uuid);
            //
            //  delete file from library table
            //
            const library = yield library_repo_1.default.getLibraryByFileUuid(jobData.file_uuid);
            if (library) {
                yield library_repo_1.default.deleteLibraryFile(library.uuid);
            }
            //
            //  send mail
            //
            yield sendUploadFailedToUser(jobData);
        }
        else {
            if (jobData.extra_data && jobData.extra_data != null) {
                //
                //  get job status based on file uuid
                //
                const jobStatusFrame = yield video_repo_1.default.checkAwsBatchJobFrameCompletedStatus(jobData.file_uuid);
                const jobStatusAudio = yield video_repo_1.default.checkAwsBatchJobAudioCompletedStatus(jobData.file_uuid);
                if (jobStatusFrame) {
                    const container = {
                        input: {
                            body: {
                                sequence_uuid: jobData.extra_data.sequence_uuid,
                                file_uuid: jobData.file_uuid
                            },
                            logged_in_user: {
                                uuid: jobData.user_uuid
                            },
                            query: {
                                production_uuid: jobData.extra_data.production_uuid
                            }
                        },
                        output: {},
                        derived: {
                            saveFrames: {
                                file_uuid: jobData.file_uuid
                            },
                            production: jobData.extra_data.production_uuid,
                            timeLineUuid: jobData.extra_data.timeline_uuid,
                            layerDetails: jobData.extra_data.layer_data,
                            storeFrames: true,
                            audio: jobStatusAudio ? true : false
                        }
                    };
                    yield socketlib_1.default.sendDetailsFileUuid(container);
                }
                else {
                    const container = {
                        input: {
                            body: {
                                sequence_uuid: jobData.extra_data.sequence_uuid,
                                file_uuid: jobData.file_uuid
                            },
                            logged_in_user: {
                                uuid: jobData.user_uuid
                            },
                            query: {
                                production_uuid: jobData.extra_data.production_uuid
                            }
                        },
                        output: {},
                        derived: {
                            saveFrames: {
                                file_uuid: jobData.file_uuid
                            },
                            production: jobData.extra_data.production_uuid,
                            timeLineUuid: jobData.extra_data.timeline_uuid,
                            layerDetails: jobData.extra_data.layer_data,
                            storeFrames: false,
                            audio: false
                        }
                    };
                    yield socketlib_1.default.sendDetailsFileUuid(container);
                }
            }
            //
            //  get job status based on file uuid
            //
            const jobStatus = yield video_repo_1.default.checkAwsBatchJobCompletedStatus(jobData.file_uuid);
            if (jobStatus) {
                //
                //  update status of file
                //
                const fileModel = {
                    status: constant_1.default.file.status.COMPLETED,
                    updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
                };
                yield file_repo_1.default.updateFiledata(jobData.file_uuid, fileModel);
            }
        }
        return jobData;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : send email to user regarding upload failed
🗓 @created : 23/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendUploadFailedToUser = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    let message;
    try {
        //
        // get user details
        //
        const user = yield user_repo_1.default.getUserByUuid(jobData.user_uuid);
        if (user.language == constant_1.default.user_language.ENGLISH) {
            //
            // creating data for email 
            // 
            message = {
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('upload_failed.verify_email_english'),
                welcome_text: i18n_1.default.__('upload_failed.welcome_text'),
                glad_text: i18n_1.default.__('upload_failed.glad_text'),
                head_text: i18n_1.default.__('upload_failed.head_text'),
                para_text: i18n_1.default.__('upload_failed.para_text'),
                button_text: i18n_1.default.__('upload_failed.button_text'),
                para_second_text: i18n_1.default.__('upload_failed.para_second_text_english'),
                query_text: i18n_1.default.__('upload_failed.query_text'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/library`
            };
            // 
            // getting html from template 
            // 
            message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.UPLOAD_FILE_FAILED, message);
            yield (0, sendEmail_1.default)(message);
        }
        else {
            //
            // creating data for email 
            // 
            message = {
                to: [{ email: user.email }],
                sender: { email: constant_1.default.app.FROM_EMAIL },
                subject: i18n_1.default.__('upload_failed.verify_email_dutch'),
                welcome_text: i18n_1.default.__('upload_failed.welcome_text_dutch'),
                glad_text: i18n_1.default.__('upload_failed.glad_text_dutch'),
                head_text: i18n_1.default.__('upload_failed.head_text_dutch'),
                para_text: i18n_1.default.__('upload_failed.para_text_dutch'),
                button_text: i18n_1.default.__('upload_failed.button_text_dutch'),
                para_second_text: i18n_1.default.__('upload_failed.para_second_text_dutch'),
                query_text: i18n_1.default.__('upload_failed.query_text_dutch'),
                logo: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/logo.png`,
                top_banner: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/top_banner.png`,
                bottom_image: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/bottomimage.png`,
                google: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/google.png`,
                facebook: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/facebook.png`,
                linkedin: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/linkedin.png`,
                twitter: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/twitter.png`,
                message_box: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/images/messagebox.png`,
                font: `${constant_1.default.app.VIDEO_FREDO_BE_URL}/assets/fonts/FatFrank-Heavy.ttf`,
                redirect_uri: `${constant_1.default.app.VIDEO_FREDO_FE_URL}/library`
            };
            // 
            // getting html from template 
            // 
            message.htmlContent = yield email_helper_1.default.ejsToHtml(constant_1.default.email_templates.UPLOAD_FILE_FAILED, message);
            yield (0, sendEmail_1.default)(message);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = validateJobStatus;
//# sourceMappingURL=validateAllJobsStatus.service.js.map