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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Models
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const video_repo_1 = __importDefault(require("../../viedo/repo/video.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get export auto settings service
🗓 @created : 04/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const exportAutoSettingService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  check production exists or not 
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        //  get file details 
        //
        yield getFileDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get file details by production uuid and sort the quality
🗓 @created : 04/12/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  get files detail stored into production timeline by production uuid
        //
        const fileDetails = yield production_repo_1.default.getFileDetailsByProductionUuid(params.production_uuid);
        const resolution = [];
        for (const fileData of fileDetails) {
            if (fileData.layer_type == 'TEXT') {
                resolution.push('HD');
            }
            if (fileData.file_uuid) {
                //
                //  get file quality by file uuid and store into array
                //
                const fileQuality = yield file_repo_1.default.getFileByUuid(fileData.file_uuid);
                if (fileQuality.type == 'video') {
                    resolution.push(fileQuality.resolution_type);
                }
                else {
                    resolution.push('HD');
                }
            }
        }
        if (resolution && resolution.length > 0) {
            const resolutionConfigArray = constant_1.default.resolution_type;
            const resoulutionConfig = Object.values(resolutionConfigArray);
            var minPriority = resolution[0];
            for (let i = 0; i < resolution.length; i++) {
                if (resoulutionConfig.indexOf(minPriority) > resoulutionConfig.indexOf(resolution[i])) {
                    minPriority = resolution[i];
                }
            }
            if (!resoulutionConfig.includes(minPriority)) {
                minPriority = 'HD';
            }
        }
        //
        //  get the duration
        //
        const maxEndTime = Math.max(...fileDetails
            .filter(item => item.layer_data && item.layer_data.endTime !== undefined)
            .map(item => item.layer_data.endTime || 0));
        //
        //  get video configuration by resolution type
        //
        const videoConfiguration = yield video_repo_1.default.getVideoConfigurationByResolutionType(minPriority);
        if (videoConfiguration) {
            //
            //  store result into container
            //
            container.output.result = {
                pixel_size: videoConfiguration.pixel_size,
                aspect_ratio: videoConfiguration.aspect_ratio,
                comman_name: videoConfiguration.common_name,
                resolution_type: videoConfiguration.resolution_type,
                duration: maxEndTime
            };
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = exportAutoSettingService;
//# sourceMappingURL=getExportAutoSetting.service.js.map