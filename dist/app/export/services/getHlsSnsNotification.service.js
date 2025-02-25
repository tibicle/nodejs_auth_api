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
const getHlsSnsNotificationService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  get embed code exist
        //
        container.derived.jobId = yield export_repo_1.default.checkJobId(container.derived.jobId);
        if (container.derived.jobId && container.derived.status == 'COMPLETE') {
            //
            // Remove the prefix
            //
            const file_url = container.derived.hlsFile.split('/').pop();
            const hlsFileModel = {
                embed_hls_file_name: file_url,
                hls_status: 'COMPLETED'
            };
            //
            // update model by job id
            //
            yield export_repo_1.default.updateExportDetailsByExportUuid(container.derived.jobId.uuid, hlsFileModel);
        }
        else {
            console.log(container.derived.status);
            if (container.derived.status == 'ERROR') {
                //
                //  Hls Error model
                //
                const hlsErrorModel = {
                    hls_error: container.derived.errorMessage,
                    hls_status: 'FAILED'
                };
                //
                //  update error by job id
                //
                yield export_repo_1.default.updateExportDetailsByExportUuid(container.derived.jobId.uuid, hlsErrorModel);
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getHlsSnsNotificationService;
//# sourceMappingURL=getHlsSnsNotification.service.js.map