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
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
class videoRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get frames by file uuid
    🗓 @created : 17/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFrames(fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [frames] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.VIDEO_FRAME}`)
                    .where('file_uuid', fileUuid);
                return frames;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save video frames
    🗓 @created : 25/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveFrame(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [frameUuid] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.VIDEO_FRAME}`)
                    .insert(data)
                    .returning('*');
                return frameUuid;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get video configurations
    🗓 @created : 04/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideoConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videoConfigurations = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.VIDEO_CONFIGURATION}`);
                return videoConfigurations;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get video configuration by name
    🗓 @created : 04/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getVideoConfigurationByResolutionType(resoltuionType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [videoConfigurations] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.VIDEO_CONFIGURATION}`)
                    .where('resolution_type', resoltuionType);
                return videoConfigurations;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save job details
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveJobDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [frameUuid] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .insert(data)
                    .returning('*');
                return frameUuid;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get job details by job Id
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getJobDetailsById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [jobDetails] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .where('job_id', jobId);
                return jobDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update aws job status
    🗓 @created : 19/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateAwsJobStatus(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobStatus = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .update(data)
                    .where('uuid', uuid);
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant shekhar
   🚩 @uses : check job status
   🗓 @created : 23/12/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    checkAwsBatchJobStatus(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [jobStatus] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .where('file_uuid', uuid)
                    .andWhere(function () {
                    this.where('type', 'FRAME')
                        .orWhere('type', 'CONVERTVIDEO')
                        .orWhere('type', 'JSON');
                })
                    .andWhere('status', 'FAILED');
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant shekhar
    🚩 @uses : check job status
    🗓 @created : 23/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteAwsBatchJobs(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobStatus = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .del()
                    .where('file_uuid', uuid);
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant shekhar
    🚩 @uses : check job completed status
    🗓 @created : 31/12/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkAwsBatchJobCompletedStatus(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [jobStatus] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .where('file_uuid', uuid)
                    .andWhere(function () {
                    this.where('type', 'FRAME')
                        .andWhere('type', 'CONVERTVIDEO')
                        .andWhere('type', 'JSON');
                })
                    .andWhere('status', 'COMPLETED');
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant shekhar
   🚩 @uses : check job completed status
   🗓 @created : 31/12/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    checkAwsBatchJobFrameCompletedStatus(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [jobStatus] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .where('file_uuid', uuid)
                    .andWhere('type', 'FRAME')
                    .andWhere('status', 'COMPLETED');
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant shekhar
   🚩 @uses : check job completed status
   🗓 @created : 31/12/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    checkAwsBatchJobAudioCompletedStatus(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [jobStatus] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.AWS_JOB}`)
                    .where('file_uuid', uuid)
                    .andWhere('type', 'AUDIO')
                    .andWhere('status', 'COMPLETED');
                return jobStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new videoRepo();
//# sourceMappingURL=video.repo.js.map