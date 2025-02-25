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
// Import Static
// Import Middleware
// Import services
const saveExportDetails_service_1 = __importDefault(require("../services/saveExportDetails.service"));
const getExportDetails_service_1 = __importDefault(require("../services/getExportDetails.service"));
const updateExportStatus_service_1 = __importDefault(require("../services/updateExportStatus.service"));
const getExportAutoSetting_service_1 = __importDefault(require("../services/getExportAutoSetting.service"));
const createExportFolder_service_1 = __importDefault(require("../services/createExportFolder.service"));
const getExportedVideos_service_1 = __importDefault(require("../services/getExportedVideos.service"));
const deleteExportedVideo_service_1 = __importDefault(require("../services/deleteExportedVideo.service"));
const updateProductionS3Usage_service_1 = __importDefault(require("../services/updateProductionS3Usage.service"));
const updateExportData_service_1 = __importDefault(require("../services/updateExportData.service"));
const getHlsNotification_service_1 = __importDefault(require("../services/getHlsNotification.service"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
const calculateS3Usage_helper_1 = __importDefault(require("../../../helpers/calculateS3Usage.helper"));
const calculateFolderSize_helper_1 = __importDefault(require("../../../helpers/calculateFolderSize.helper"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const getEmbedCode_service_1 = __importDefault(require("../services/getEmbedCode.service"));
const checkEmbedCode_service_1 = __importDefault(require("../services/checkEmbedCode.service"));
const createHlsVideo_service_1 = __importDefault(require("../services/createHlsVideo.service"));
const getExportVideo_service_1 = __importDefault(require("../../exportVideo/services/getExportVideo.service"));
const https_1 = __importDefault(require("https"));
class ExportController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save export file details API
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveExportFileDetails(req, res, next) {
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
                //  save export details service
                //
                yield (0, saveExportDetails_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
                //
                //  create export folder
                //
                yield (0, createExportFolder_service_1.default)(container);
                try {
                    console.log("container.output.result", container.output.result);
                    // console.log("container.output.result",container.output.result);
                    //
                    //  export video
                    //
                    yield (0, getExportVideo_service_1.default)(container.output.result);
                }
                catch (error) {
                    console.log(JSON.stringify(error));
                }
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get export details by uuid API
    🗓 @created : 31/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportFileDetails(req, res, next) {
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
                //  get export details service
                //
                yield (0, getExportDetails_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update export file status API
    🗓 @created : 01/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExportFileStatus(req, res, next) {
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
                //  update export file status service
                //
                yield (0, updateExportStatus_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
                if (container.input.body.status == 'COMPLETED') {
                    //
                    //  get production details by uuid
                    //
                    container.derived.productionDetails = yield production_repo_1.default.checkProductionByUuid(container.derived.productionExportDetails.production_uuid);
                    // console.log("productionDetails",container.derived.productionDetails);
                    const fileDetails = yield file_repo_1.default.getFileByUuid(container.derived.productionExportDetails.file_uuid);
                    // console.log("fileDetails",fileDetails);
                    //
                    //  get production folder path
                    //
                    const productionFolderPath = yield calculateS3Usage_helper_1.default.getProductionFolderPath(container.derived.productionDetails.company_uuid, container.derived.productionExportDetails.created_by.uuid, container.derived.productionDetails);
                    // console.log(productionFolderPath,"path");
                    //
                    //  get the folder size of the file store while uploading production export video
                    //
                    container.derived.productionFolderSize = yield calculateFolderSize_helper_1.default.calculateSize(productionFolderPath);
                    // console.log("productionFolderSize",container.derived.productionFolderSize);
                    yield (0, updateProductionS3Usage_service_1.default)(container);
                }
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get export auto settings
    🗓 @created : 04/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportAutoSettings(req, res, next) {
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
                //  get export auto settings service
                //
                yield (0, getExportAutoSetting_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get export videos
    🗓 @created : 29/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExportedVideos(req, res, next) {
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
                //  get export videos service
                //
                yield (0, getExportedVideos_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete exported video
    🗓 @created : 29/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteExportedVideo(req, res, next) {
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
                //  delete export videos service
                //
                yield (0, deleteExportedVideo_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
                //
                //  get production folder path
                //
                const productionFolderPath = yield calculateS3Usage_helper_1.default.getProductionFolderPath(container.derived.productionDetails.company_uuid, container.input.logged_in_user.uuid, container.derived.productionDetails);
                //
                //  get the folder size of the file store while uploading production export video
                //
                container.derived.productionFolderSize = yield calculateFolderSize_helper_1.default.calculateSize(productionFolderPath);
                yield (0, updateProductionS3Usage_service_1.default)(container);
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update export data
    🗓 @created : 10/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateExport(req, res, next) {
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
                //  update export file service
                //
                yield (0, updateExportData_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get embed code from exported video
    🗓 @created : 22/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getEmbedVideo(req, res, next) {
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
                //  get embed video service
                //
                yield (0, getEmbedCode_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : update hls related data in export data
   🗓 @created : 04/12/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    updateExportHlsData(req, res, next) {
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
                //  update hls Data service
                //
                //await updateExportHlsDataService(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get embed code from exported video
   🗓 @created : 22/11/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getEmbedCode(req, res, next) {
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
                //  check embed code service
                //
                yield (0, checkEmbedCode_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : update hls related data in export data
   🗓 @created : 04/12/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    updateHlsStatus(req, res, next) {
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
                //  update hls status service
                //
                // await updateHlsStatusService(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : generate hls video
    🗓 @created : 06/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createHlsVideo(req, res, next) {
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
                //  create hls video service
                //
                yield (0, createHlsVideo_service_1.default)(container);
                // try {
                //     const configHeaders ={
                //         headers : {
                //             'Content-Type' : 'application/json',
                //             'Authorization': `Bearer ${config.app.EXPORT_SECERET_KEY}`
                //         }
                //     }
                //     const responseData = await axios.post(`${config.app.HLS_CREATE_URL}`, container.output.result, configHeaders);
                // } catch (error) {
                //     console.log(JSON.stringify(error));
                // }
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
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
                        console.log('SubscriptionConfirmation message received:', snsMessage);
                        //
                        //  subscribe url
                        //
                        const subscribeUrl = snsMessage.SubscribeURL;
                        if (!subscribeUrl) {
                            console.error('SubscribeURL is undefined. Check SNS message format.');
                        }
                        console.log('Confirming subscription at:', subscribeUrl);
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
                            //
                            //  Parse the Message property
                            //
                            //const parsedMessage = JSON.parse(notificationMessage.Message);
                            //
                            //  Details saved in container
                            //
                            if (notificationMessage && notificationMessage.detail) {
                                container.derived.jobId = notificationMessage.detail.jobId;
                                container.derived.status = notificationMessage.detail.status;
                                container.derived.errorMessage = notificationMessage.detail.errorMessage;
                                if (Array.isArray(notificationMessage.detail.outputGroupDetails) && notificationMessage.detail.outputGroupDetails.length > 0) {
                                    container.derived.hlsFile = notificationMessage.detail.outputGroupDetails[0].playlistFilePaths[0] || null;
                                }
                                else {
                                    container.derived.hlsFile = null;
                                }
                            }
                            else {
                                console.error("Notification message structure is incorrect or missing required details.");
                            }
                            //
                            //  get notification from sns subscription service
                            //
                            yield (0, getHlsNotification_service_1.default)(container);
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
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new ExportController();
//# sourceMappingURL=export.controller.js.map