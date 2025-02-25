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
// Import Services
const convertVideo_service_1 = __importDefault(require("../services/convertVideo.service"));
const getFrames_service_1 = __importDefault(require("../services/getFrames.service"));
const updateMediaDetails_1 = __importDefault(require("../services/updateMediaDetails"));
const getVideoConfiguration_service_1 = __importDefault(require("../services/getVideoConfiguration.service"));
const calculateS3Usage_helper_1 = __importDefault(require("../../../helpers/calculateS3Usage.helper"));
const updateLibraryS3Usage_serive_1 = __importDefault(require("../services/updateLibraryS3Usage.serive"));
const createThumbnailImage_service_1 = __importDefault(require("../services/createThumbnailImage.service"));
const generateFrames_job_service_1 = __importDefault(require("../services/generateFrames-job.service"));
const extractAudio_job_service_1 = __importDefault(require("../services/extractAudio-job.service"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const socketlib_1 = __importDefault(require("../../../library/socketlib"));
const extractVideo_service_1 = __importDefault(require("../services/extractVideo.service"));
const calculateFolderSize_helper_1 = __importDefault(require("../../../helpers/calculateFolderSize.helper"));
const lowResolutionVideo_service_1 = __importDefault(require("../services/lowResolutionVideo.service"));
class videoController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : video controller
    🗓 @created : 22/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    videoToFrame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  convert video into frames service
                //
                yield (0, getFrames_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
                if (container.output.message == i18n_1.default.__('frame.generating_frame')) {
                    console.log("BEFORE PROMISE");
                    const [videoContainer, audioContainer] = yield Promise.all([(0, convertVideo_service_1.default)(container), (0, extractVideo_service_1.default)(container)]);
                    console.log("AFTER PROMISE");
                    yield socketlib_1.default.sendFileUuid(videoContainer);
                    console.log("audioContainer", audioContainer);
                    //await convertVideo(container);
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
    🚩 @uses : update video details
    🗓 @created : 09/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateMediaDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update video details service
                //
                yield (0, updateMediaDetails_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
                if (container.derived.fileDetails.type == constant_1.default.media_type.video) {
                    //
                    //  create thumbnail image
                    //
                    yield (0, createThumbnailImage_service_1.default)(container);
                    //
                    //  generate frames
                    //
                    yield (0, generateFrames_job_service_1.default)(container);
                    //
                    //  extract audio
                    //
                    yield (0, extractAudio_job_service_1.default)(container);
                    //
                    //  convert video to 720p
                    //
                    yield (0, lowResolutionVideo_service_1.default)(container);
                }
                //
                //  get library folder path
                //
                const libraryFolderPath = yield calculateS3Usage_helper_1.default.getLibraryFolderPath(container.input.body.company_uuid, container.input.logged_in_user.uuid, container.derived.fileDetails.name);
                //
                //  get the folder size of the file store while uploading library
                //
                container.derived.libraryFolderSize = yield calculateFolderSize_helper_1.default.calculateSize(libraryFolderPath);
                //
                //  update library s3 usage service
                //
                yield (0, updateLibraryS3Usage_serive_1.default)(container);
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
    🚩 @uses : get video configuration
    🗓 @created : 04/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideoConfiguration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        query: req.query,
                        params: req.params,
                        logged_in_user: req.logged_in_user
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get video congiguration details service
                //
                yield (0, getVideoConfiguration_service_1.default)(container);
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
exports.default = new videoController();
//# sourceMappingURL=video.controller.js.map