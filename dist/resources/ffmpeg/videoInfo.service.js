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
const constant_1 = __importDefault(require("../../config/constant"));
const awsS3_1 = __importDefault(require("../../config/awsS3"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
// Import Thirdparty
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const util_1 = __importDefault(require("util"));
const { promisify } = require('util');
const stream = require('stream');
const promisifiedFfprobe = util_1.default.promisify(fluent_ffmpeg_1.default.ffprobe);
const ffprobe = require('fluent-ffmpeg').ffprobe;
const { PassThrough } = require('stream');
const pipeline = promisify(stream.pipeline);
const fs = require('fs');
const path = require('path');
class VideoInfoService {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : extract video info
    🗓 @created : 12/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    extractVideoInfo(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3ReadStream = yield awsS3_1.default.getObject({ Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`, Key: `${file}` }).createReadStream();
                // const probePromise = new Promise((resolve, reject) => {
                //     ffprobe(s3ReadStream, (err:any, metadata:any) => {
                //       if (err) return reject(err);
                //       resolve(metadata);
                //     });
                //   });
                const metadata = yield promisifiedFfprobe(s3ReadStream);
                // try {
                //     const metadata:any = await probePromise;
                //     console.log("========metadata=========");
                //     console.log(metadata);
                //     return metadata.streams;
                //   } catch (error) {
                //     console.error("Error fetching metadata:", error);
                //     return null;
                //   }
                return metadata.streams;
            }
            catch (error) {
                console.log("=========ERROR FROM HERE=========");
                console.log(JSON.stringify(error));
                throw error;
            }
        });
    }
    extractFileInfo(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tempFilePath = path.join('/tmp', path.basename(file));
                // Download the file from S3 to a temporary location
                yield pipeline(awsS3_1.default.getObject({
                    Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
                    Key: `${file}`
                }).createReadStream(), fs.createWriteStream(tempFilePath));
                // Retrieve metadata using ffmpeg
                return new Promise((resolve, reject) => {
                    fluent_ffmpeg_1.default.ffprobe(tempFilePath, (err, metadata) => {
                        fs.unlinkSync(tempFilePath); // Clean up the temporary file
                        if (err)
                            return reject(err);
                        const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
                        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                        const result = {
                            duration: metadata.format ? metadata.format.duration : 'N/A',
                            size: metadata.format ? metadata.format.size : 'N/A',
                            audioStream,
                            videoStream,
                        };
                        resolve(result);
                    });
                });
            }
            catch (error) {
                console.log("=========ERROR FROM HERE=========");
                console.log(JSON.stringify(error));
                throw error;
            }
        });
    }
}
exports.default = new VideoInfoService();
//# sourceMappingURL=videoInfo.service.js.map