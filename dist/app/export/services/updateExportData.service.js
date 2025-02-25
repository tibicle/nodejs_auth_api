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
// Import Models
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update export file status service
🗓 @created : 01/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportDataService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check export file exists or not
        //
        container.derived.exportData = yield export_repo_1.default.checkExportFileByUuid(params.uuid);
        if (body.name && body.name != null) {
            //
            //  check name 
            //
            yield checkName(container);
        }
        //
        //  update export file status
        //
        yield updateExportFileStatus(container);
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('export.update_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update the export file data
🗓 @created : 10/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateExportFileStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { productionExportDetails } } = container;
        //
        // prepare data model to update export file status
        //
        const updateExportDataModel = {
            name: body.name,
            seo_title: body.seo_title,
            description: body.description,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_by: logged_in_user.uuid
        };
        //
        //  update data into production export 
        //
        yield export_repo_1.default.updateExportDetails(params.uuid, updateExportDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check name is already present with same company or not
🗓 @created : 1/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { exportData } } = container;
        //
        //  check that same name exist or not 
        //
        const exportDataDetails = yield export_repo_1.default.validateExportName(body.name, exportData.production_uuid);
        if (exportDataDetails) {
            if (exportDataDetails.created_by == exportData.created_by) {
                if (exportDataDetails.production_uuid == exportData.production_uuid && exportDataDetails.uuid !== exportData.uuid) {
                    const err = new Error(i18n_1.default.__("export.name_already_exist"));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                const err = new Error(i18n_1.default.__("export.name_already_exist"));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateExportDataService;
//# sourceMappingURL=updateExportData.service.js.map