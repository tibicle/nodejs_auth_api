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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
// Import Services
const audio_service_1 = __importDefault(require("../../../resources/ffmpeg/audio.service"));
// Import Helpers
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const awsS3_1 = __importDefault(require("../../../config/awsS3"));
const fs_1 = __importDefault(require("fs"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const extractAudio = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName, file } } = container;
        console.log("inside AUDIO extract");
        const productionDetails = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        if (productionDetails && productionDetails.company_uuid) {
            //
            //  get library details by file uuid
            //
            const libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(file.uuid);
            container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, libraryDetails.user_uuid, file.name);
        }
        else {
            container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, logged_in_user.uuid, file.name);
        }
        container.derived.audioData = yield audio_service_1.default.createAudio(`${container.derived.fileName}/${file.name}`, file.uuid);
        const audioKey = 'audio' + Date.now() + '.mp3';
        const fileContent = fs_1.default.createReadStream(`${container.derived.audioData}`);
        const audioUploadParams = {
            Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
            Key: `${container.derived.fileName}/${audioKey}`,
            Body: fileContent,
            ContentType: 'audio/mp3'
        };
        const uploadAudio = yield awsS3_1.default.upload(audioUploadParams).promise();
        if (uploadAudio) {
            fs_1.default.unlinkSync(`${container.derived.audioData}`);
        }
        console.log(audioKey);
        container.derived.audio = audioKey;
        //
        //  prepare data model to update file data
        //
        const updateFileData = {
            ref_type: "user_library",
            audio_name: audioKey
        };
        yield file_repo_1.default.updateFiledata(file.uuid, updateFileData);
        return container;
    }
    catch (error) {
        console.log(JSON.stringify(error));
    }
});
exports.default = extractAudio;
//# sourceMappingURL=extractVideo.service.js.map