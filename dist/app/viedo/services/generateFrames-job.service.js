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
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const video_repo_1 = __importDefault(require("../repo/video.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const aws_1 = __importDefault(require("../../../library/aws"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const awsBatch_service_1 = __importDefault(require("../../../resources/awsBatch/awsBatch.service"));
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
const convertVideoJob = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { files } } = container;
        console.log("INSIDE FRAME COMMAND");
        //
        //  generate frames
        //
        yield generateFrames(container);
        return container;
    }
    catch (error) {
        console.log("error", JSON.stringify(error));
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : generate frames
🗓 @created : 25/08/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const generateFrames = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails } } = container;
        //
        //  get production details
        //
        // const productionDetails = await productionRepo.checkProductionByUuid(params.production_uuid);
        if (body.company_uuid) {
            //
            //  get library details by file uuid
            //
            const libraryDetails = yield library_repo_1.default.getLibraryByFileUuid(fileDetails.uuid);
            //
            //  get file path
            //
            var fileUrl = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, libraryDetails.user_uuid, fileDetails.name);
        }
        else {
            //
            //  get file path
            //
            var fileUrl = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, logged_in_user.uuid, fileDetails.name);
        }
        //
        //  check and create folder to store frames
        //
        if (body.company_uuid) {
            const bucket = `${constant_1.default.app.AWS_BUCKET_NAME}`;
            //
            //  check company folder exists or not
            //
            container.derived.companyDetails = yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            const companyUuid = container.derived.companyDetails.uuid.replace(/-/g, '_');
            // if(container.derived.companyDetails.name.includes(" ")){
            // var companyName = container.derived.companyDetails.name.replace(/\s/g, '');
            // }else{
            // var companyName = container.derived.companyDetails.name
            // }
            var companyName = constant_1.default.folder_prefix.COMPANY;
            const companyFolder = `${companyName}_${companyUuid}/`;
            yield aws_1.default.checkAndCreateFolder(bucket, companyFolder);
            //
            //  create library folder inside company folder if not exists
            //
            const library = constant_1.default.folder.LIBRARY;
            //
            //  check library folder exists or not
            //
            const libraryFolder = `${companyFolder}${library}/`;
            var librarykey = yield aws_1.default.checkAndCreateFolder(bucket, libraryFolder);
            //
            //  check for user folder into library
            //
            const userDetails = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
            const userUuid = userDetails.uuid.replace(/-/g, '_');
            const userFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            const userLibraryFolder = `${libraryFolder}${userFolder}`;
            var uploadKey = yield aws_1.default.checkAndCreateFolder(bucket, userLibraryFolder);
        }
        else {
            const bucket = `${constant_1.default.app.AWS_BUCKET_NAME}`;
            //
            //  check self folder exists or not
            //
            container.derived.userDetails = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
            const userUuid = container.derived.userDetails.uuid.replace(/-/g, '_');
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            yield aws_1.default.checkAndCreateFolder(bucket, selfFolder);
            //
            //  create library folder inside self folder if not exists
            //
            const library = constant_1.default.folder.LIBRARY;
            //
            //  check library folder exists or not
            //
            const libraryFolder = `${selfFolder}${library}/`;
            var uploadKey = yield aws_1.default.checkAndCreateFolder(bucket, libraryFolder);
        }
        const fileName = fileDetails.name.split(".");
        container.derived.inputVideoUrl = `${fileUrl}/${fileDetails.name}`;
        container.derived.outputVideoUrl = `${fileUrl}`;
        const thumbnailSize = constant_1.default.frame.thumbnail_size;
        container.derived.timeStamp = Date.now();
        const ffmpegArgs = [
            '-i', 'pipe:0',
            '-f', 'image2pipe',
            '-vf', `fps='${constant_1.default.app.FPS}',scale='${thumbnailSize}'`,
            '-c:v', 'png',
            '-pix_fmt', 'rgb24',
            '-'
        ];
        const frameGenerationBatch = yield awsBatch_service_1.default.generateFrameJob(container);
        console.log("aws fram batch job===================");
        console.log(frameGenerationBatch);
        if (frameGenerationBatch) {
            //
            //  prepare data model to save the aws bact job details
            //
            const jobDetailsDataModel = {
                job_id: frameGenerationBatch.jobId,
                file_uuid: fileDetails.uuid,
                status: constant_1.default.job_status.IN_PROCESS,
                name: `${container.derived.outputVideoUrl}/frames${container.derived.timeStamp}`,
                type: 'FRAME',
                user_uuid: logged_in_user.uuid,
                company_uuid: body.company_uuid ? body.company_uuid : null,
                extra_data: container.derived.extraData ? container.derived.extraData : null,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  save job details
            //
            yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
        }
        // const frameData:any = [];
        // const frames:any = [];
        // const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
        // let frameIndex = 0;
        // await new Promise<void>((resolve, reject) => {
        //     ffmpegProcess.stdout.on('data', async (data) => {
        //         frameData.push(data);
        //         frameIndex++;
        //     });
        //     ffmpegProcess.stderr.on('data', (data) => {
        //         console.error('FFmpeg stderr:', data.toString());
        //     });
        //     ffmpegProcess.on('close', async (code) => {
        //         if (code === 0) {
        //             console.log('Video conversion completed.');
        //             const frameName = 'frames' + Date.now();
        //             const folderName = `${uploadKey}${fileName[0]}/${frameName}`;
        //             // Upload frames to S3 bucket
        //             const frameUploadPromises = frameData.map(async (frame:any, index:any) => {
        //                 const frameKey = `${folderName}/frame_${index}.png`;
        //                 const frameUploadParams = {
        //                     Bucket: `${config.app.AWS_BUCKET_NAME}`,
        //                     Key: frameKey,
        //                     Body: frame,
        //                     ContentType: 'image/png'
        //                 };
        //                 const uploadFrame = await s3.upload(frameUploadParams).promise();
        //                 const responseFrame = uploadFrame.Key;
        //                 frames.push(responseFrame)
        //             });
        //             await Promise.all(frameUploadPromises);
        //             container.derived.storeFrames = frames
        //             await saveVideoFrame(container);
        //             resolve();
        //         } else {
        //             console.error(`Video conversion failed with code ${code}`);
        //             reject();
        //         }
        //     });
        //     //
        //     //  get video object from s3 bucket
        //     //
        //     const s3Stream:any = s3.getObject({ Bucket: `${config.app.AWS_BUCKET_NAME}`, Key: inputVideoUrl }).createReadStream();
        //     s3Stream.pipe(ffmpegProcess.stdin);
        // });
        return container;
    }
    catch (error) {
        console.log("error which is not handled", JSON.stringify(error));
        console.error('An error occurred during frame conversion:', JSON.stringify(error));
        // throw error;
    }
});
const saveVideoFrame = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, derived: { storeFrames, file } } = container;
        if (storeFrames) {
            //
            //  prepare data model to save frames
            //
            const saveFrameModel = {
                file_uuid: file.uuid,
                frame: storeFrames,
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
            };
            //
            //  save the video frames
            //
            container.derived.saveFrames = yield video_repo_1.default.saveFrame(saveFrameModel);
            container.derived.production = query.production_uuid;
            // if(container.derived.saveFrames){
            //     await socketlib.sendFileUuid(container);
            // }
        }
        return container;
    }
    catch (error) {
        console.log("=====save video service error block======");
        console.log(JSON.stringify(error));
        throw error;
    }
});
exports.default = convertVideoJob;
//# sourceMappingURL=generateFrames-job.service.js.map