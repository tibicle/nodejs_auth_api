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
const export_repo_1 = __importDefault(require("../repo/export.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check embed code exist or not.
🗓 @created : 04/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateHlsStatusService = (data, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  get embed code exist
        //
        let jobIdDetails = yield export_repo_1.default.checkJobId(jobId);
        if (jobIdDetails && data.hls_status == 'COMPLETED') {
            const hlsFileModel = {
                embed_hls_file_name: data.embed_hls_file_name,
                hls_status: data.hls_status
            };
            //
            // update model by job id
            //
            yield export_repo_1.default.updateExportDetailsByJobId(jobId, hlsFileModel);
        }
        else {
            if (data.hls_status == 'FAILED') {
                //
                //  Hls Error model
                //
                const hlsErrorModel = {
                    hls_error: data.hls_error,
                    hls_status: data.hls_status
                };
                //
                //  update error by job id
                //
                yield export_repo_1.default.updateExportDetailsByJobId(jobId, hlsErrorModel);
            }
        }
        // return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateHlsStatusService;
//# sourceMappingURL=updateHlsStatus.service.js.map