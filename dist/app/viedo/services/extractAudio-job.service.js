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
const awsBatch_service_1 = __importDefault(require("../../../resources/awsBatch/awsBatch.service"));
// Import Helpers
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const video_repo_1 = __importDefault(require("../repo/video.repo"));
const extractAudioJob = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName, file } } = container;
        console.log("inside AUDIO extract");
        // const productionDetails = await productionRepo.checkProductionByUuid(params.production_uuid);
        if (body.company_uuid) {
            //
            //  get library details by file uuid
            //
            const libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileDetails.uuid);
            container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, libraryDetails.user_uuid, fileDetails.name);
        }
        else {
            container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, logged_in_user.uuid, fileDetails.name);
        }
        container.derived.audioKey = 'audio' + Date.now() + '.mp3';
        // const inputVideoS3Path = `s3://${config.app.AWS_BUCKET_NAME}/${fileName}/${fileDetails.name}`;
        // const audioCheckCommand = `ffprobe -i "${inputVideoS3Path}" -show_streams -select_streams a -loglevel error`;
        // const { stdout } = await exec(audioCheckCommand);
        // console.log("=====stdout=====");
        // console.log(stdout);
        const audioBatch = yield awsBatch_service_1.default.createAudioJob(container);
        if (audioBatch) {
            //
            //  prepare data model to save the aws bact job details
            //
            const jobDetailsDataModel = {
                job_id: audioBatch.jobId,
                file_uuid: fileDetails.uuid,
                status: constant_1.default.job_status.IN_PROCESS,
                name: container.derived.audioKey,
                type: 'AUDIO',
                user_uuid: logged_in_user.uuid,
                company_uuid: body.company_uuid ? body.company_uuid : null,
                extra_data: container.derived.extraData,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
        }
        // container.derived.audioData = await audioService.createAudio(`${container.derived.fileName}/${fileDetails.name}`,fileDetails.uuid);
        // const audioKey = 'audio' + Date.now() + '.mp3';
        // const fileContent:any = fs.createReadStream(`${container.derived.audioData}`);
        // const audioUploadParams = {
        //     Bucket: `${config.app.AWS_BUCKET_NAME}`,
        //     Key: `${container.derived.fileName}/${audioKey}`,
        //     Body: fileContent,
        //     ContentType: 'audio/mp3'
        // };
        // const uploadAudio = await s3.upload(audioUploadParams).promise();
        // if(uploadAudio){
        //     fs.unlinkSync(`${container.derived.audioData}`);
        // }
        // console.log(audioKey);
        // container.derived.audio = audioKey
        // //
        // //  prepare data model to update file data
        // //
        // const updateFileData = {
        //     ref_type: "user_library",
        //     audio_name: audioKey
        // }
        // await fileRepo.updateFiledata(file.uuid, updateFileData);
        return container;
    }
    catch (error) {
        console.log(JSON.stringify(error));
    }
});
exports.default = extractAudioJob;
//# sourceMappingURL=extractAudio-job.service.js.map