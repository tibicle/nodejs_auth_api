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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const video_repo_1 = __importDefault(require("../repo/video.repo"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : convert video into frame
🗓 @created : 22/08/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
//
//  store frame to array buffer and upload the frames into s3 bucket
//
const getFrame = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, derived: { files } } = container;
        //
        //  check file exists or not
        //
        container.derived.file = yield file_repo_1.default.checkFile(query.file_uuid);
        //
        //  check prodcution exists or not 
        //
        const production = yield production_repo_1.default.checkProductionByUuid(query.production_uuid);
        if (production) {
            //
            //  check file exists in production media or not
            //
            yield production_repo_1.default.checkFileInProductionMedia(production.uuid, container.derived.file.uuid);
            container.derived.production = production.uuid;
        }
        //
        //  check frame exisits or not 
        //
        const getFrames = yield video_repo_1.default.getFrames(container.derived.file.uuid);
        if (getFrames) {
            const resultFrames = getFrames.frame;
            const finalFrames = resultFrames.sort((a, b) => {
                const frameNumberA = parseInt(a.match(/frame_(\d+)/)[1]);
                const frameNumberB = parseInt(b.match(/frame_(\d+)/)[1]);
                return frameNumberA - frameNumberB;
            }).map((frame) => constant_1.default.app.CLOUDFRONT_URL + '/' + frame);
            container.output.result = finalFrames;
        }
        else {
            container.output.result = [];
            container.output.message = i18n_1.default.__('frame.generating_frame');
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getFrame;
//# sourceMappingURL=getFrames.service.js.map