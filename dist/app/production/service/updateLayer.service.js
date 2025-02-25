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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Models
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update layer into production timeline service
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLayerService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  update the production timeline data
        //
        if (body.data && body.data.length > 0) {
            var timeLineuuid = [];
            var sequenceUuid = body.data[0].sequence_uuid;
            let transaction;
            for (let i = 0; i < body.data.length; i++) {
                const layerData = body.data[i];
                timeLineuuid.push(layerData.uuid);
                var production_uuid = params.production_uuid;
                if (layerData.file_data) {
                    //
                    //  prepare data model to update file details
                    //
                    const updateFileDetails = {
                        length: layerData.file_data.length,
                        size: layerData.file_data.size,
                        quality: layerData.file_data.quality
                    };
                    if (i == 0) {
                        //
                        //  update file details
                        //
                        var updatedFileDetails = yield file_repo_1.default.updateFiledataTrx(layerData.file_data.uuid, updateFileDetails, 0);
                        transaction = updatedFileDetails.trx;
                    }
                    else {
                        //
                        //  update file details
                        //
                        var updatedFileDetails = yield file_repo_1.default.updateFiledataTrx(layerData.file_data.uuid, updateFileDetails, 1, transaction);
                        transaction = updatedFileDetails.trx;
                    }
                }
                //
                //  prepare data model to update json data
                //
                const updateLayerData = {
                    layer_data: layerData.layer_data,
                    sort_order: i + 1,
                    updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: logged_in_user.uuid
                };
                if (layerData && layerData.uuid) {
                    //
                    //  update layer data into production timeline
                    //
                    var updateLayerDetails = yield production_repo_1.default.updateLayerDataTrx(layerData.uuid, updateLayerData, transaction);
                    transaction = updateLayerDetails.trx;
                }
                else {
                    console.log("SORRY WE CANNOT ADD LAYER, PLEASE TRY AGAIN AFTER SOME TIME");
                    const err = new Error(i18n_1.default.__('production.layer_update_failed'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            //
            //  delete other layer data
            //
            yield production_repo_1.default.deleteLayerDataTrx(timeLineuuid, sequenceUuid, updateLayerDetails.trx);
        }
        else {
            if (body.sequence_uuid) {
                yield production_repo_1.default.deleteLayer(body.sequence_uuid);
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateLayerService;
//# sourceMappingURL=updateLayer.service.js.map