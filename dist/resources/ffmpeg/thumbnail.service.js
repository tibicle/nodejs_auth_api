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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Services
const upsertErrorLogs_service_1 = __importDefault(require("../../app/file/services/upsertErrorLogs.service"));
const fs_1 = __importDefault(require("fs"));
const fs1 = require('fs').promises;
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("../../config/util"));
const aws_1 = __importDefault(require("../../library/aws"));
class ThumbnailService {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create one thumbnail image from video
    🗓 @created : 12/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createImage(file, fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signedUrl = yield aws_1.default.getImageSignedUrl(file);
                const outputPath = path_1.default.join(__dirname, '../../../assets/thumbnailImages');
                const outputFolderPath = path_1.default.join(__dirname, '../../../assets/thumbnailImages');
                yield this.checkFolderExists(outputFolderPath);
                const outputFilePath = `${outputPath}/output_image_${Date.now()}.png`;
                yield (0, util_1.default)(`ffmpeg -i "${signedUrl}" -frames:v 1 "${outputFilePath}"`);
                return outputFilePath;
            }
            catch (error) {
                const err = {
                    thumbnail: []
                };
                err.thumbnail.push({
                    message: error.message,
                    code: error.code,
                    time: error.time,
                    command: error.cmd
                });
                if (fileUuid) {
                    yield (0, upsertErrorLogs_service_1.default)(err, fileUuid);
                }
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check folder exists or not
    🗓 @created : 07/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkFolderExists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs1.access(path, fs_1.default.constants.F_OK);
            }
            catch (error) {
                yield fs1.mkdir(path, { recursive: true });
            }
        });
    }
}
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : process using ffmpeg to create image
🗓 @created : 13/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
// async createffmpegImage(file:any) {
//     try {
//         return new Promise((resolve, reject) => {
//             const ffmpegArgs = [
//                 '-i', 'pipe:0',  // Input from stdin
//                 '-ss', '00:00:05', // Seek to 5 seconds into the video (you can adjust this)
//                 '-vframes', '1',  // Capture only 1 frame (the thumbnail)
//                 '-f', 'image2',   // Output format as an image
//                 '-'              // Output image to stdout
//             ];
//             let thumbnailData:any = Buffer.from([]);
//             const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'pipe', 'pipe'] })
//             //
//             //  register the event 
//             //
//             ffmpegProcess.stdout.on('data', (data) => {
//                 thumbnailData = Buffer.concat([thumbnailData, data]);
//             });
//             ffmpegProcess.on('close', (code) => {
//                 if (code === 0) {
//                     resolve(thumbnailData);
//                 } else {
//                     reject(new Error(`Thumbnail extraction failed with code ${code}`))
//                 }
//             });
//             ffmpegProcess.on('error', (error) => {
//                 reject(error);
//             });
//             //
//             //  start the process
//             //
//             ffmpegProcess.stdin.on('end', () => {
//                 // Close the FFmpeg process stdin when the S3 stream ends
//                 ffmpegProcess.stdin.end();
//             });
//             s3.getObject({ Bucket: `${config.app.AWS_BUCKET_NAME}`, Key: file})
//                 .createReadStream().on('error',(error:any) => {
//                     if(error) {
//                         reject(error);
//                     } 
//                 })
//                 .pipe(ffmpegProcess.stdin)
//                 .on('error',(error)=>{
//                     reject(error);
//                 });
//         }).catch(error => {
//             throw error;
//         });
//     } catch (error:any) {
//         throw error;
//     }
// }
exports.default = new ThumbnailService();
//# sourceMappingURL=thumbnail.service.js.map