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
const constant_1 = __importDefault(require("../../../config/constant"));
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get layer service
🗓 @created : 18/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getLayerService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check production exists or not 
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        //  get layers from production time line
        //
        const layer = yield production_repo_1.default.getLayerByProductionUuid(container);
        if (logged_in_user) {
            //
            //  get production details
            //
            const productionDetails = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
            for (const data of layer) {
                if (data.layer_type != constant_1.default.layer_type.TEXT) {
                    if (productionDetails.company_uuid) {
                        //
                        //  get file path
                        //
                        var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, data.user_uuid, data.file_data.name);
                    }
                    else {
                        //
                        //  get file path
                        //
                        var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, data.user_uuid, data.file_data.name);
                    }
                }
                data.file_data.url = `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.name}`;
                data.file_data.audio_url = data.file_data.audio_url ? `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.audio}` : null;
                data.file_data.thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.thumbnail}`;
                data.file_data.low_res_file_url = data.file_data.low_resolution_name ? `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.low_resolution_name}` : null;
            }
        }
        else {
            //
            //  get production details
            //
            const productionDetails = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
            for (const data of layer) {
                if (data.layer_type != constant_1.default.layer_type.TEXT) {
                    if (productionDetails.company_uuid) {
                        //
                        //  get file path
                        //
                        var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, query.user_uuid, data.file_data.name);
                    }
                    else {
                        //
                        //  get file path
                        //
                        var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, query.user_uuid, data.file_data.name);
                    }
                }
                data.file_data.url = `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.name}`;
                data.file_data.audio_url = `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.audio}`;
                data.file_data.thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${data.file_data.thumbnail}`;
            }
        }
        if (logged_in_user) {
            //
            //  update sequence data
            //
            yield updateSequenceData(container);
        }
        const audioLayer = layer.map((item) => {
            if (item.layer_type === constant_1.default.layer_type.AUDIO) {
                item.file_data.frames = [];
            }
        });
        // if(audioLayer && audioLayer.file_data.frames.length > 0){
        //     audioLayer.file_data.frames = [];
        // }
        container.output.result = layer;
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update sequence data
🗓 @created : 15/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateSequenceData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  prepare data model to update the last selected sequence true
        //
        const sequenceDataModel = {
            last_selected: true,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_by: logged_in_user.uuid
        };
        //
        // update sequence data
        //
        yield production_repo_1.default.updateSequence(query.sequence_uuid, sequenceDataModel);
        //
        //  make rest sequence false
        //
        const sequenceDataModelLastSelected = {
            last_selected: false,
            updated_by: logged_in_user.uuid
        };
        //
        // update sequence data
        //
        yield production_repo_1.default.updateSequence(query.sequence_uuid, sequenceDataModelLastSelected, params.production_uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getLayerService;
//# sourceMappingURL=getLayer.service.js.map