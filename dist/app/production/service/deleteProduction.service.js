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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Libraries
// Import services
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete production by using transaction service
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteProductionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        var productionData = container.input.query.production_uuid;
        if (Array.isArray(productionData)) {
            for (let i = 0; i < productionData.length; i++) {
                //
                //  validate production exist or not
                //
                yield production_repo_1.default.checkProductionByUuid(container.input.query.production_uuid[i]);
                //
                //  delete production timeline by production uuid
                //
                const productionTimelineData = yield production_repo_1.default.deleteProductionTimeline(container.input.query.production_uuid[i]);
                //
                //  delete production media by production uuid
                //
                const productionMediaData = yield production_repo_1.default.productionMediaDelete(container.input.query.production_uuid[i], productionTimelineData.trx);
                //
                //  delete production export by production uuid
                //
                const productionExportData = yield production_repo_1.default.deleteProductionExport(container.input.query.production_uuid[i], productionMediaData.trx);
                //
                //  delete production  by production uuid
                //
                const productionData = yield production_repo_1.default.deleteProduction(container.input.query.production_uuid[i], productionExportData.trx);
            }
        }
        else {
            //
            //  validate production exist or not
            //
            yield production_repo_1.default.checkProductionByUuid(container.input.query.production_uuid);
            //
            //  delete production timeline by production uuid
            //
            const productionTimelineData = yield production_repo_1.default.deleteProductionTimeline(container.input.query.production_uuid);
            //
            //  delete production media by production uuid
            //
            const productionMediaData = yield production_repo_1.default.productionMediaDelete(container.input.query.production_uuid, productionTimelineData.trx);
            //
            //  delete production export by production uuid
            //
            const productionExportData = yield production_repo_1.default.deleteProductionExport(container.input.query.production_uuid, productionMediaData.trx);
            //
            //  delete production  by production uuid
            //
            const productionData = yield production_repo_1.default.deleteProduction(container.input.query.production_uuid, productionExportData.trx);
        }
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('production.production_deleted');
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteProductionService;
//# sourceMappingURL=deleteProduction.service.js.map