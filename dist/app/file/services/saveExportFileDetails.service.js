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
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save export file details service
🗓 @created : 16/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveExportDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  prepare data model to save export file details into file table
        //
        const saveExportDetailsDataModel = {
            name: body.name,
            ref_uuid: null,
            ref_type: null,
            aws_s3_url: body.url,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        container.derived.fileData = yield file_repo_1.default.saveFileData(saveExportDetailsDataModel);
        yield updateFileInExport(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save file uuid into export table and update file table
🗓 @created : 16/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFileInExport = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { fileData } } = container;
        //
        //  prepare data model to update file details
        //
        const updateExportDetailsDataModel = {
            file_uuid: fileData[0].uuid,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        yield export_repo_1.default.updateExportDetails(body.production_uuid, updateExportDetailsDataModel);
        //
        //  prepare data model to update ref uuid
        //
        const updateFileDataModel = {
            ref_uuid: body.production_uuid,
            ref_type: 'EXPORT',
            type: 'video'
        };
        yield file_repo_1.default.updateFiledata(fileData[0].uuid, updateFileDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveExportDetails;
//# sourceMappingURL=saveExportFileDetails.service.js.map