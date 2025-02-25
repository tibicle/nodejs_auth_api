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
const export_repo_1 = __importDefault(require("../repo/export.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save error logs service for export
🗓 @created : 16/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const exportError = (productionExportUuid, error) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  get export details by export uuid
        //
        const exportDetails = yield export_repo_1.default.checkExportFileByUuid(productionExportUuid);
        if (exportDetails) {
            //
            //  upsert error logs
            //
            yield upsertErrorLogs(exportDetails, error);
        }
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : upsert error logs
🗓 @created : 16/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const upsertErrorLogs = (exportDetails, error) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (error.exportDetails) {
            if (exportDetails.error_log && exportDetails.error_log.exportDetails.length >= 0) {
                //
                //  append export error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.exportDetails[0];
                errorLog.exportDetails.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append export error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the export details error
                //
                const saveExportDetailsError = {
                    status: 'FAILED',
                    error_log: {
                        layerDetails: [],
                        trimError: [],
                        videoSegment: [],
                        cmdErr: [],
                        s3UploadErr: [],
                        signedUrlErr: [],
                        exportDetails: error.exportDetails
                    }
                };
                //
                //  save export details error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, saveExportDetailsError);
            }
        }
        if (error.layerDetails) {
            if (exportDetails.error_log && exportDetails.error_log.layerDetails.length >= 0) {
                //
                //  append layer details error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.layerDetails[0];
                errorLog.layerDetails.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append layer details error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the layer details error
                //
                const savelayerDetailsError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        trimError: [],
                        videoSegment: [],
                        cmdErr: [],
                        s3UploadErr: [],
                        signedUrlErr: [],
                        layerDetails: error.layerDetails
                    }
                };
                //
                //  save layer details error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, savelayerDetailsError);
            }
        }
        if (error.signedUrlErr) {
            if (exportDetails.error_log && exportDetails.error_log.signedUrlErr.length >= 0) {
                //
                //  append signed url error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.signedUrlErr[0];
                errorLog.signedUrlErr.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append signed url error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the signed url error
                //
                const saveSignedUrlError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        trimError: [],
                        videoSegment: [],
                        cmdErr: [],
                        s3UploadErr: [],
                        layerDetails: [],
                        signedUrlErr: error.signedUrlErr
                    }
                };
                //
                //  save signed url error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, saveSignedUrlError);
            }
        }
        if (error.videoSegment) {
            if (exportDetails.error_log && exportDetails.error_log.videoSegment.length >= 0) {
                //
                //  append video segment error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.videoSegment[0];
                errorLog.videoSegment.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append video segment error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the video segment error
                //
                const saveVideoSegmentError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        trimError: [],
                        signedUrlErr: [],
                        cmdErr: [],
                        s3UploadErr: [],
                        layerDetails: [],
                        videoSegment: error.videoSegment
                    }
                };
                //
                //  save video segment error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, saveVideoSegmentError);
            }
        }
        if (error.trimError) {
            if (exportDetails.error_log && exportDetails.error_log.trimError.length >= 0) {
                //
                //  append trim video error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.trimError[0];
                errorLog.trimError.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append trim video error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the trim video error
                //
                const savenTrimVideoError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        videoSegment: [],
                        signedUrlErr: [],
                        cmdErr: [],
                        s3UploadErr: [],
                        layerDetails: [],
                        trimError: error.trimError
                    }
                };
                //
                //  save trim video error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, savenTrimVideoError);
            }
        }
        if (error.cmdErr) {
            if (exportDetails.error_log && exportDetails.error_log.cmdErr.length >= 0) {
                //
                //  append concat video error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.cmdErr[0];
                errorLog.cmdErr.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append concat video error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the concat video error
                //
                const saveConcatVideoError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        videoSegment: [],
                        signedUrlErr: [],
                        trimError: [],
                        s3UploadErr: [],
                        layerDetails: [],
                        cmdErr: error.cmdErr
                    }
                };
                //
                //  save concat video error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, saveConcatVideoError);
            }
        }
        if (error.s3UploadErr) {
            if (exportDetails.error_log && exportDetails.error_log.s3UploadErr.length >= 0) {
                //
                //  append s3 upload error
                //
                const errorLog = exportDetails.error_log;
                const newError = error.s3UploadErr[0];
                errorLog.s3UploadErr.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs,
                    status: 'FAILED'
                };
                //
                //  append s3 upload error logs
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the s3 upload error
                //
                const saveS3UploadError = {
                    status: 'FAILED',
                    error_log: {
                        exportDetails: [],
                        videoSegment: [],
                        signedUrlErr: [],
                        trimError: [],
                        cmdErr: [],
                        layerDetails: [],
                        s3UploadErr: error.s3UploadErr
                    }
                };
                //
                //  save s3 upload error
                //
                yield export_repo_1.default.updateExportFileStatus(exportDetails.uuid, saveS3UploadError);
            }
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = exportError;
//# sourceMappingURL=exportErrorLogs.service.js.map