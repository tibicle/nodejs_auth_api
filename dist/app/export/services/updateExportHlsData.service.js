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
// Import Models
const export_repo_1 = __importDefault(require("../repo/export.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update export file status service
🗓 @created : 27/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportHlsDataService = (exportUuid, uniqueCode, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  check export file exists or not
        //
        let exportData = yield export_repo_1.default.checkExportFileByUuid(exportUuid);
        //
        //  update export file status
        //
        yield updateExportHlsData(exportUuid, uniqueCode, jobId);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update the export file data
🗓 @created : 27/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportHlsData = (exportUuid, uniqueCode, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        // prepare data model to update export file status
        //
        const updateExportDataModel = {
            hls_jobid: jobId,
            embed_code: uniqueCode,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  update data into production export 
        //
        yield export_repo_1.default.updateExportDetails(exportUuid, updateExportDataModel);
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateExportHlsDataService;
//# sourceMappingURL=updateExportHlsData.service.js.map