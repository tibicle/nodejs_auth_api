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
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save error logs service
🗓 @created : 16/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveErrorLogs = (error, fileUuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  get file details by file uuid
        //
        const fileDetails = yield file_repo_1.default.getFileByUuid(fileUuid);
        if (fileDetails) {
            //
            //  upsert error logs
            //
            yield upsertErrorLogs(fileDetails, error);
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
🗓 @created : 16/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const upsertErrorLogs = (fileDetails, error) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (error.thumbnail) {
            if (fileDetails.error_log && fileDetails.error_log.thumbnail.length >= 0) {
                //
                //  append thumbnail error
                //
                const errorLog = fileDetails.error_log;
                const newError = error.thumbnail[0];
                errorLog.thumbnail.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs
                };
                //
                //  append thumbnail error logs
                //
                yield file_repo_1.default.updateFiledata(fileDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the thumbnail error
                //
                const saveThumbnailError = {
                    error_log: {
                        audio: [],
                        thumbnail: error.thumbnail
                    }
                };
                //
                //  save thumbnail error
                //
                yield file_repo_1.default.updateFiledata(fileDetails.uuid, saveThumbnailError);
            }
        }
        if (error.audio) {
            if (fileDetails.error_log && fileDetails.error_log.audio.length >= 0) {
                //
                //  append audio error
                //
                const errorLog = fileDetails.error_log;
                const newError = error.audio[0];
                errorLog.audio.push(newError);
                const appendLogs = errorLog;
                //
                //  prepare data model to append error log
                //
                const appendDataModel = {
                    error_log: appendLogs
                };
                //
                //  append audio error logs
                //
                yield file_repo_1.default.updateFiledata(fileDetails.uuid, appendDataModel);
            }
            else {
                //
                //  prepare data model to save the audio error
                //
                const saveAudioError = {
                    error_log: {
                        thumbnail: [],
                        audio: error.audio
                    }
                };
                //
                //  save audio error
                //
                yield file_repo_1.default.updateFiledata(fileDetails.uuid, saveAudioError);
            }
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveErrorLogs;
//# sourceMappingURL=upsertErrorLogs.service.js.map