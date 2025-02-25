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
const constant_1 = __importDefault(require("../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
// Import Services
// Import Helpers
// Import Repos
const file_repo_1 = __importDefault(require("../../app/file/repo/file.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save file details
🗓 @created : 19/12/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFileDetails = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  prepare data model to update file data
        //
        const updateFileData = {
            thumbnail_file_name: jobData.name
        };
        yield file_repo_1.default.updateFiledata(jobData.file_uuid, updateFileData);
        //
        //  update aws job status
        //
        const updateAwsJobStatusDataModel = {
            status: constant_1.default.job_status.COMPLETED,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        yield video_repo_1.default.updateAwsJobStatus(jobData.uuid, updateAwsJobStatusDataModel);
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveFileDetails;
//# sourceMappingURL=saveThumbnailDetails.service.js.map