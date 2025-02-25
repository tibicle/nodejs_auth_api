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
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Libraries
// Import services
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete production media
🗓 @created : 23/01/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteProductionMediaService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        //  validate production media exist or not
        //
        const productionMedia = yield production_repo_1.default.checkProductionMediaByUuid(params.uuid);
        //
        //  get library details
        //
        const libraryDetails = yield library_repo_1.default.getLibraryByUuid(productionMedia.library_uuid);
        if (libraryDetails) {
            //
            //  get timeline data 
            //
            const timelineData = yield production_repo_1.default.getMultipleTimelineData(libraryDetails.file_uuid, productionMedia.production_uuid);
            if (timelineData && timelineData.length > 0) {
                for (const data of timelineData) {
                    //
                    //  delete timeline data 
                    //
                    yield production_repo_1.default.deleteTimeline(data.uuid);
                }
            }
        }
        //
        //  delete production media
        //
        yield production_repo_1.default.deleteProductionMediaByUuid(params.uuid);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('production.production_media_deleted');
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteProductionMediaService;
//# sourceMappingURL=deleteProductionMedia.service.js.map