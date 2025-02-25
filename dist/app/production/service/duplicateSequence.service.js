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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
// Import Libraries
// Import services
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : duplicate sequence.
🗓 @created : 10/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const duplicateSequenceService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params, body, query } } = container;
        //
        //  check production exists or not 
        //
        const sequenceDetail = yield production_repo_1.default.getSequenceBySequenceUuid(params.sequence_uuid);
        if (!sequenceDetail) {
            const err = new Error(i18n_1.default.__('production.sequence_not_exists'));
            err.statusCode = 400;
            throw err;
        }
        const nameSequence = (i18n_1.default.__('production.duplicate_sequence_prefix'));
        //
        //  prepare data model to add sequence 
        //
        const sequenceDataModel = {
            title: nameSequence + sequenceDetail.title,
            production_uuid: sequenceDetail.production_uuid,
            last_selected: sequenceDetail.last_selected,
            target_audience: sequenceDetail.target_audience,
            sort_order: sequenceDetail.sort_order,
            dead_line: sequenceDetail.dead_line,
            script: sequenceDetail.script,
            project_planning: sequenceDetail.project_planning,
            status: constant_1.default.sequence_status.PRE_PRODUCTION,
            aspect_ratio: sequenceDetail.aspect_ratio,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            created_by: logged_in_user.uuid,
            updated_by: null,
            updated_at: null
        };
        //
        //  save sequence
        //
        container.derived.sequenceData = yield production_repo_1.default.saveSequenceTransaction(sequenceDataModel);
        //
        //  duplicate export data
        //
        //await duplicateExportData(container)
        //
        //  duplicate timeline data
        //
        yield duplicateTimelineData(container);
        //
        //  success message
        //
        container.output.message = (i18n_1.default.__('production.duplicate'));
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : duplicate export data on the basis of sequence uuid
🗓 @created : 10/05/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const duplicateExportData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  get export data by sequence uuid
        //
        const exportFileData = yield export_repo_1.default.getExportVideoDetailsByUuid(params.sequence_uuid);
        //
        //  prepare data model to save the export data
        //
        const saveExportDetailsDataModel = {
            production_uuid: exportFileData.production_uuid,
            file_uuid: exportFileData.file_uuid,
            sequence_uuid: exportFileData.sequence_uuid,
            name: exportFileData.name,
            type: exportFileData.type,
            quality: exportFileData.quality,
            fps: exportFileData.fps,
            error_log: exportFileData.error_log,
            start_time: exportFileData.start_time,
            end_time: exportFileData.end_time,
            total_time: exportFileData.total_time,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            created_by: logged_in_user.uuid,
            updated_by: null,
            updated_at: null
        };
        //
        //  save export data
        //
        const exportData = yield export_repo_1.default.saveExportDetails(saveExportDetailsDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : duplicate production timeline data on the basis of sequence uuid
🗓 @created : 10/05/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const duplicateTimelineData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { sequenceData } } = container;
        let allProductionTimeline = [];
        //
        //  get export data by sequence uuid
        //
        let productionTimeline = yield production_repo_1.default.getTimelineDataBySequenceUuid(params.sequence_uuid);
        for (let prodTimeline of productionTimeline) {
            //
            //  prepare data model to save the export data
            //
            const saveProductionTimeline = {
                production_uuid: prodTimeline.production_uuid,
                file_uuid: prodTimeline.file_uuid,
                sequence_uuid: sequenceData.sequenceData.uuid,
                status: prodTimeline.status,
                layer_type: prodTimeline.layer_type,
                layer_data: prodTimeline.layer_data,
                sort_order: prodTimeline.sort_order,
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                created_by: logged_in_user.uuid,
                updated_by: null,
                updated_at: null
            };
            allProductionTimeline.push(saveProductionTimeline);
        }
        let sequenceDataTrx = sequenceData.trx;
        //
        //  save timeline
        //
        const timeline = yield production_repo_1.default.addProductionTimeLineTransaction(allProductionTimeline, sequenceDataTrx);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = duplicateSequenceService;
//# sourceMappingURL=duplicateSequence.service.js.map