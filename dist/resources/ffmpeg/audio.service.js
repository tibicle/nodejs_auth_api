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
// Import Service
const upsertErrorLogs_service_1 = __importDefault(require("../../app/file/services/upsertErrorLogs.service"));
const fs_1 = __importDefault(require("fs"));
const fs1 = require('fs').promises;
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("../../config/util"));
const aws_1 = __importDefault(require("../../library/aws"));
class AudioService {
    createAudio(file, fileUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signedUrl = yield aws_1.default.getImageSignedUrl(file);
                const outputPath = path_1.default.join(__dirname, '../../../assets/audioFiles');
                const outputFolderPath = path_1.default.join(__dirname, '../../../assets/audioFiles');
                yield this.checkFolderExists(outputFolderPath);
                const outputFilePath = `${outputPath}/output_audio_${Date.now()}.mp3`; // Output audio file path
                // const audioCheckCommand = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of csv=p=0 "${signedUrl}"`;
                // const { stdout } = await exec(audioCheckCommand);
                // console.log("=====stdout=====");
                // console.log(stdout);
                // console.log("+++++++++++++COMMAND++++++++++");
                // console.log(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`);
                // MAIN
                // await exec(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`); // Command to extract audio
                // return outputFilePath
                // if (stdout.includes('audio')) {
                //     console.log("+++++++++++++COMMAND++++++++++");
                //     console.log(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`);
                //     await exec(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`);
                //     return outputFilePath;
                // } else {
                //     console.log("No audio stream found.");
                //     return null;
                // }
                // Check for audio and ensure it's not silent
                // const audioCheckCommand = `ffmpeg -i "${signedUrl}" -af "astats=metadata=1:reset=1" -f null - 2>&1 | grep 'RMS level'`;
                // const { stdout } = await exec(audioCheckCommand);
                const audioCheckCommand = `ffprobe -i "${signedUrl}" -show_streams -select_streams a -loglevel error`;
                const { stdout } = yield (0, util_1.default)(audioCheckCommand);
                console.log("=====stdout=====");
                console.log(stdout);
                // const hasAudio = stdout.split('\n').some((line:any) => {
                //     const rmsMatch = line.match(/RMS level dB: ([\-\d\.]+)/);
                //     if (rmsMatch) {
                //         const rmsLevel = parseFloat(rmsMatch[1]);
                //         return rmsLevel > -70; // Adjust threshold as needed
                //     }
                //     return false;
                // });
                if (stdout) {
                    // console.log("+++++++++++++COMMAND++++++++++");
                    // console.log(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`);
                    yield (0, util_1.default)(`ffmpeg -i "${signedUrl}" -vn -acodec libmp3lame "${outputFilePath}"`);
                    return outputFilePath;
                }
                else {
                    console.log("No valid audio found.");
                    return null;
                }
            }
            catch (error) {
                const err = {
                    audio: []
                };
                err.audio.push({
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
exports.default = new AudioService();
//# sourceMappingURL=audio.service.js.map