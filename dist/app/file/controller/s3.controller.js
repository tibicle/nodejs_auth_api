"use strict";
// Import Config
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
// Import Services
const saveFile_service_1 = __importDefault(require("../services/saveFile.service"));
const getFileList_service_1 = __importDefault(require("../services/getFileList.service"));
const getPreSignedUrl_service_1 = __importDefault(require("../services/getPreSignedUrl.service"));
const saveExportFileDetails_service_1 = __importDefault(require("../services/saveExportFileDetails.service"));
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class s3Controller {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to upload file to s3 bucket
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    uploadFiletoS3(req, res, next) {
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
                container.derived.files = [];
                container.derived.files = req.files.map((file) => {
                    let fileName = file.key;
                    if (req.query.type === 'INVOICE') {
                        fileName = fileName.split('/').pop();
                    }
                    if (req.query.type === 'TEAM') {
                        fileName = fileName.split('/').pop();
                    }
                    if (req.query.type === 'USER_PROFILE_PIC') {
                        fileName = fileName.split('/').pop();
                    }
                    if (req.query.type === 'FONT') {
                        fileName = fileName.split('/').pop();
                    }
                    if (req.query.type === 'COMPANY_PROFILE_PIC') {
                        fileName = fileName.split('/').pop();
                    }
                    if (req.query.type === 'EXPORT_EMBED_PIC') {
                        fileName = fileName.split('/').pop();
                    }
                    return {
                        url: file.location,
                        name: fileName,
                        type: file.mimetype
                    };
                });
                //
                // save the files service
                //
                yield (0, saveFile_service_1.default)(container);
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
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get video list
    🗓 @created : 22/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideoFile(req, res, next) {
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
                //  get video list service
                //
                yield (0, getFileList_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : get pre signed URL
    🗓 @created : 09/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getPreSignedUrl(req, res, next) {
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
                //  get pre signed url service
                //
                yield (0, getPreSignedUrl_service_1.default)(container);
                //
                //  send the response
                //
                res.status(http_status_codes_1.default.OK).json(yield response_helper_1.default.successResponse(container.output));
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
    🚩 @uses : save export file details
    🗓 @created : 16/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveExportFile(req, res, next) {
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
                //  save export file details service
                //
                yield (0, saveExportFileDetails_service_1.default)(container);
                //
                //  send the response
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
exports.default = new s3Controller();
//# sourceMappingURL=s3.controller.js.map