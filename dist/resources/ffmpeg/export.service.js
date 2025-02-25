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
const constant_1 = __importDefault(require("../../config/constant"));
// import aws from "../../library/aws";
const exportAws_1 = __importDefault(require("../../library/exportAws"));
const https_1 = __importDefault(require("https"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Service
// import restApiService from "../http/restApi.service";
// Import Transformers
// Import Libraries
// Import Repos
// Import Thirdparty
const fs_1 = __importDefault(require("fs"));
const fs1 = require('fs').promises;
const path_1 = __importDefault(require("path"));
const awsBatch_service_1 = __importDefault(require("../awsBatch/awsBatch.service"));
const moment_1 = __importDefault(require("moment"));
const video_repo_1 = __importDefault(require("../../app/viedo/repo/video.repo"));
class ExportService {
    clearDirectory(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs_1.default.promises.readdir(directoryPath);
                // Loop through and remove each file in the directory
                for (const file of files) {
                    const filePath = path_1.default.join(directoryPath, file);
                    yield fs_1.default.promises.unlink(filePath);
                }
                console.log(`All files cleared from directory: ${directoryPath}`);
            }
            catch (error) {
                console.error(`Error clearing directory: ${error.message}`);
            }
        });
    }
    downloadFont(url, savePath, sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = path_1.default.basename(url); // Get the filename from the URL
            // const filePath = path.join(savePath, fileName);  // Full path where the font will be saved
            const ext = path_1.default.extname(fileName); // Get the file extension
            const baseName = path_1.default.basename(fileName, ext); // Get the filename without the extension
            fileName = `${baseName}_${sequenceUuid}${ext}`;
            const filePath = path_1.default.join(savePath, fileName);
            // Ensure the save directory exists
            if (!fs_1.default.existsSync(savePath)) {
                fs_1.default.mkdirSync(savePath, { recursive: true });
            }
            return new Promise((resolve, reject) => {
                // Create the write stream for saving the file
                const fileStream = fs_1.default.createWriteStream(filePath);
                // Download the file
                https_1.default.get(url, (response) => {
                    response.pipe(fileStream);
                    // On finish of writing the file
                    fileStream.on('finish', () => {
                        fileStream.close();
                        // console.log(`Font downloaded and saved to: ${filePath}`);
                        resolve(filePath); // Resolve the promise with the file path
                    });
                    // Handle stream error
                    fileStream.on('error', (err) => {
                        fs_1.default.unlink(filePath, () => reject(err)); // Delete partial file and reject
                    });
                }).on('error', (err) => {
                    reject(err); // Reject the promise if https.get fails
                });
            });
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create video segments
    🗓 @created : 18/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createVideoSegments(layerData, productionExportUuid, quality, sequenceUuid, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videoSegments = [];
                for (const data of layerData) {
                    if (data.layer_type == "VIDEO") {
                        // const fileName = await exportS3FolderService.getFolderPath(body,data.file_data.name);
                        // const strippedUrl = data.layer_data.source.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const inputPath = data.layer_data.source_backend.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        // const signedUrl = await exportAws.getSignedUrl(`${strippedUrl}`, productionExportUuid,sequenceUuid);
                        const actualWidth = quality.split('x')[0] * data.layer_data.position.width / 500;
                        let roundOffW = Math.ceil(actualWidth);
                        if (roundOffW % 2 != 0) {
                            roundOffW = roundOffW + 1;
                        }
                        const actualHeight = quality.split('x')[1] * data.layer_data.position.height / 500;
                        let roundOffH = Math.ceil(actualHeight);
                        if (roundOffH % 2 != 0) {
                            roundOffH = roundOffH + 1;
                        }
                        const actualTop = quality.split('x')[1] * data.layer_data.position.top / 500;
                        let roundOffT = Math.floor(actualTop);
                        const actualLeft = quality.split('x')[0] * data.layer_data.position.left / 500;
                        let roundOffL = Math.floor(actualLeft);
                        const rotateTop = quality.split('x')[1] * data.layer_data.position.rectTop / 500;
                        let roundOffRT = Math.floor(rotateTop);
                        const rotateLeft = quality.split('x')[0] * data.layer_data.position.rectLeft / 500;
                        let roundOffRL = Math.floor(rotateLeft);
                        const rotateHeight = quality.split('x')[1] * data.layer_data.position.rectHeight / 500;
                        let roundOffRH = Math.floor(rotateHeight);
                        const rotateWidth = quality.split('x')[0] * data.layer_data.position.rectWidth / 500;
                        let roundOffRW = Math.floor(rotateWidth);
                        const videoObject = {
                            // video: signedUrl,
                            start: data.layer_data.videoStartTime,
                            end: data.layer_data.videoEndTime,
                            duration: data.layer_data.videoEndTime - data.layer_data.videoStartTime,
                            width: roundOffW,
                            height: roundOffH,
                            top: roundOffT,
                            left: roundOffL,
                            trimmedVideo: 'trimmed_video' + '_' + Date.now() + '_' + data.sort_order + '.mp4',
                            resolution: quality,
                            objectType: 'VIDEO',
                            rTop: roundOffRT,
                            rHeight: Math.abs(roundOffRH),
                            rLeft: roundOffRL,
                            rWidth: Math.abs(roundOffRW),
                            rotation: data.layer_data.position.rotation,
                            animation: data.layer_data.animation,
                            overlayStartTime: data.layer_data.startTime,
                            overlayEndTime: data.layer_data.endTime,
                            filePath: inputPath,
                            ffmpegTrimmedVideo: 'ffmpeg_trimmed_video' + '_' + Date.now() + '_' + data.sort_order + '.mp4',
                        };
                        videoSegments.push(videoObject);
                    }
                    if (data.layer_type == "TEXT") {
                        const removeColonFromText = data.layer_data.text.replace(/:/g, '\\:'); // Inline replacement
                        let changedText = removeColonFromText;
                        var downloadUrl = data.layer_data.font.fontUrl.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        var fontWeight = `${downloadUrl}`;
                        const actualTop = quality.split('x')[1] * data.layer_data.position.top / 500;
                        let roundOffT = Math.ceil(actualTop);
                        if (roundOffT % 2 != 0) {
                            roundOffT = roundOffT + 1;
                        }
                        var awsFontFilePath = `${downloadUrl}`;
                        var localFontFilePath = `font_${Date.now()}`;
                        const actualLeft = quality.split('x')[0] * data.layer_data.position.left / 500;
                        let roundOffL = Math.ceil(actualLeft);
                        if (roundOffL % 2 != 0) {
                            roundOffL = roundOffL + 1;
                        }
                        //
                        //  get text box width and height as per the resolution
                        //
                        const actualWidth = quality.split('x')[0] * data.layer_data.position.width / 500;
                        let roundOffW = Math.ceil(actualWidth);
                        if (roundOffW % 2 != 0) {
                            roundOffW = roundOffW + 1;
                        }
                        const actualHeight = quality.split('x')[1] * data.layer_data.position.height / 500;
                        let roundOffH = Math.ceil(actualHeight);
                        if (roundOffH % 2 != 0) {
                            roundOffH = roundOffH + 1;
                        }
                        const size = (quality.split('x')[0] * data.layer_data.font.fontSize / 500) - 2;
                        if (data.layer_data.font.textAlign == "center") {
                            if (data.layer_data.text.includes("\n")) {
                                for (const textData of data.layer_data.text_property) {
                                    const textWidth = quality.split('x')[0] * textData.width / 500;
                                    const textObject = {
                                        text: changedText,
                                        fontcolor: data.layer_data.font.fontFill,
                                        x: (roundOffL + (roundOffW - textWidth) / 2),
                                        y: videoSegments.length > 0 && videoSegments[videoSegments.length - 1].objectType == 'TEXT' ? videoSegments[videoSegments.length - 1].y + size : roundOffT,
                                        font: data.layer_data.font.fontFamily,
                                        fontsize: size,
                                        fontfile: fontWeight,
                                        start: data.layer_data.startTime,
                                        end: data.layer_data.endTime,
                                        resolution: quality,
                                        objectType: 'TEXT',
                                        animation: data.layer_data.animation,
                                        width: roundOffW,
                                        height: roundOffH,
                                        awsPath: awsFontFilePath,
                                        // localPath: localFontFilePath
                                        localPath: 'font' + '_' + Date.now() + '_' + data.sort_order + '.ttf'
                                    };
                                    videoSegments.push(textObject);
                                }
                            }
                            else {
                                const textObject = {
                                    text: changedText,
                                    fontcolor: data.layer_data.font.fontFill,
                                    x: roundOffL,
                                    y: roundOffT,
                                    font: data.layer_data.font.fontFamily,
                                    fontsize: size,
                                    fontfile: fontWeight,
                                    start: data.layer_data.startTime,
                                    end: data.layer_data.endTime,
                                    resolution: quality,
                                    objectType: 'TEXT',
                                    animation: data.layer_data.animation,
                                    width: roundOffW,
                                    height: roundOffH,
                                    awsPath: awsFontFilePath,
                                    // localPath: localFontFilePath
                                    localPath: 'font' + '_' + Date.now() + '_' + data.sort_order + '.ttf'
                                };
                                videoSegments.push(textObject);
                            }
                        }
                        else if (data.layer_data.font.textAlign == "right") {
                            if (data.layer_data.text.includes("\n")) {
                                for (const textData of data.layer_data.text_property) {
                                    const textWidth = quality.split('x')[0] * textData.width / 500;
                                    const textObject = {
                                        text: changedText,
                                        fontcolor: data.layer_data.font.fontFill,
                                        x: (roundOffL + roundOffW) - textWidth,
                                        y: videoSegments.length > 0 && videoSegments[videoSegments.length - 1].objectType == 'TEXT' ? videoSegments[videoSegments.length - 1].y + size : roundOffT,
                                        font: data.layer_data.font.fontFamily,
                                        fontsize: size,
                                        fontfile: fontWeight,
                                        start: data.layer_data.startTime,
                                        end: data.layer_data.endTime,
                                        resolution: quality,
                                        objectType: 'TEXT',
                                        animation: data.layer_data.animation,
                                        width: roundOffW,
                                        height: roundOffH,
                                        awsPath: awsFontFilePath,
                                        // localPath: localFontFilePath
                                        localPath: 'font' + '_' + Date.now() + '_' + data.sort_order + '.ttf'
                                    };
                                    videoSegments.push(textObject);
                                }
                            }
                            else {
                                const textObject = {
                                    text: changedText,
                                    fontcolor: data.layer_data.font.fontFill,
                                    x: roundOffL,
                                    y: roundOffT,
                                    font: data.layer_data.font.fontFamily,
                                    fontsize: size,
                                    fontfile: fontWeight,
                                    start: data.layer_data.startTime,
                                    end: data.layer_data.endTime,
                                    resolution: quality,
                                    objectType: 'TEXT',
                                    animation: data.layer_data.animation,
                                    width: roundOffW,
                                    height: roundOffH,
                                    awsPath: awsFontFilePath,
                                    // localPath: localFontFilePath
                                    localPath: 'font' + '_' + Date.now() + '_' + data.sort_order + '.ttf'
                                };
                                videoSegments.push(textObject);
                            }
                        }
                        else {
                            const textObject = {
                                text: changedText,
                                fontcolor: data.layer_data.font.fontFill,
                                x: roundOffL,
                                y: roundOffT,
                                font: data.layer_data.font.fontFamily,
                                fontsize: size,
                                fontfile: fontWeight,
                                start: data.layer_data.startTime,
                                end: data.layer_data.endTime,
                                resolution: quality,
                                objectType: 'TEXT',
                                animation: data.layer_data.animation,
                                width: roundOffW,
                                height: roundOffH,
                                awsPath: awsFontFilePath,
                                localPath: 'font' + '_' + Date.now() + '_' + data.sort_order + '.ttf',
                                // ffmpegTrimmedGif: 'ffmpeg_trimmed_gif' + '_' + Date.now() + '_' + data.sort_order + '.gif',
                            };
                            videoSegments.push(textObject);
                        }
                    }
                    if (data.layer_type == "IMAGE") {
                        const inputPath = data.layer_data.source_backend.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const actualWidth = quality.split('x')[0] * data.layer_data.position.width / 500;
                        let roundOffW = Math.floor(actualWidth);
                        if (roundOffW % 2 != 0) {
                            roundOffW = roundOffW + 1;
                        }
                        const actualHeight = quality.split('x')[1] * data.layer_data.position.height / 500;
                        let roundOffH = Math.floor(actualHeight);
                        if (roundOffH % 2 != 0) {
                            roundOffH = roundOffH + 1;
                        }
                        const actualTop = quality.split('x')[1] * data.layer_data.position.top / 500;
                        let roundOffT = actualTop;
                        const actualLeft = quality.split('x')[0] * data.layer_data.position.left / 500;
                        let roundOffL = actualLeft;
                        const rotateTop = quality.split('x')[1] * data.layer_data.position.rectTop / 500;
                        let roundOffRT = rotateTop;
                        const rotateLeft = quality.split('x')[0] * data.layer_data.position.rectLeft / 500;
                        let roundOffRL = rotateLeft;
                        const rotateHeight = quality.split('x')[1] * data.layer_data.position.rectHeight / 500;
                        let roundOffRH = rotateHeight;
                        const rotateWidth = quality.split('x')[0] * data.layer_data.position.rectWidth / 500;
                        let roundOffRW = rotateWidth;
                        const imageObject = {
                            // image: imageSignedUrl,
                            width: roundOffW,
                            height: roundOffH,
                            top: roundOffT,
                            left: roundOffL,
                            trimmedImage: 'trimmed_image' + '_' + Date.now() + '_' + data.sort_order + '.png',
                            start: data.layer_data.startTime,
                            end: data.layer_data.endTime,
                            duration: data.layer_data.endTime - data.layer_data.startTime,
                            resolution: quality,
                            objectType: 'IMAGE',
                            rTop: roundOffRT,
                            rHeight: roundOffRH,
                            rLeft: roundOffRL,
                            rWidth: roundOffRW,
                            rotation: data.layer_data.position.rotation,
                            animation: data.layer_data.animation,
                            overlayStartTime: data.layer_data.startTime,
                            overlayEndTime: data.layer_data.endTime,
                            filePath: inputPath,
                            ffmpegTrimmedImage: 'ffmpeg_trimmed_image' + '_' + Date.now() + '_' + data.sort_order + '.png',
                        };
                        videoSegments.push(imageObject);
                    }
                    if (data.layer_type == 'AUDIO') {
                        const strippedUrl = data.layer_data.source.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const inputPath = data.layer_data.source_backend.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const audioSignedUrl = yield exportAws_1.default.getSignedUrl(`${strippedUrl}`, productionExportUuid, sequenceUuid);
                        const audioObject = {
                            audio: audioSignedUrl,
                            trimmedAudio: 'trimmed_audio' + '_' + Date.now() + '_' + data.sort_order + '.mp3',
                            start: data.layer_data.audioStartTime,
                            end: data.layer_data.audioEndTime,
                            duration: data.layer_data.audioEndTime - data.layer_data.audioStartTime,
                            resolution: quality,
                            volume: data.layer_data.soundVolume,
                            objectType: 'AUDIO',
                            delay: data.layer_data.startTime * 1000,
                            filePath: inputPath,
                            ffmpegTrimmedAudio: 'ffmpeg_trimmed_audio' + '_' + Date.now() + '_' + data.sort_order + '.mp3',
                        };
                        videoSegments.push(audioObject);
                    }
                    if (data.layer_type == "GIF") {
                        const strippedUrl = data.layer_data.source.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const inputPath = data.layer_data.source_backend.replace(/^(?:https?:\/\/[^/]+\/)/, '');
                        const gifSignedUrl = yield exportAws_1.default.getSignedUrl(`${strippedUrl}`, productionExportUuid, sequenceUuid);
                        const actualWidth = quality.split('x')[0] * data.layer_data.position.width / 500;
                        let roundOffW = Math.ceil(actualWidth);
                        if (roundOffW % 2 != 0) {
                            roundOffW = roundOffW + 1;
                        }
                        const actualHeight = quality.split('x')[1] * data.layer_data.position.height / 500;
                        let roundOffH = Math.ceil(actualHeight);
                        if (roundOffH % 2 != 0) {
                            roundOffH = roundOffH + 1;
                        }
                        const actualTop = quality.split('x')[1] * data.layer_data.position.top / 500;
                        let roundOffT = Math.floor(actualTop);
                        const actualLeft = quality.split('x')[0] * data.layer_data.position.left / 500;
                        let roundOffL = Math.floor(actualLeft);
                        const rotateTop = quality.split('x')[1] * data.layer_data.position.rectTop / 500;
                        let roundOffRT = Math.floor(rotateTop);
                        const rotateLeft = quality.split('x')[0] * data.layer_data.position.rectLeft / 500;
                        let roundOffRL = Math.floor(rotateLeft);
                        const rotateHeight = quality.split('x')[1] * data.layer_data.position.rectHeight / 500;
                        let roundOffRH = Math.floor(rotateHeight);
                        const rotateWidth = quality.split('x')[0] * data.layer_data.position.rectWidth / 500;
                        let roundOffRW = Math.floor(rotateWidth);
                        const gifObject = {
                            gif: gifSignedUrl,
                            width: roundOffW,
                            height: roundOffH,
                            top: roundOffT,
                            left: roundOffL,
                            trimmedGif: 'trimmed_gif' + '_' + Date.now() + '_' + data.sort_order + '.gif',
                            start: data.layer_data.startTime,
                            end: data.layer_data.endTime,
                            duration: data.layer_data.endTime - data.layer_data.startTime,
                            resolution: quality,
                            objectType: 'GIF',
                            rTop: roundOffRT,
                            rHeight: Math.abs(roundOffRH),
                            rLeft: roundOffRL,
                            rWidth: Math.abs(roundOffRW),
                            rotation: data.layer_data.position.rotation,
                            animation: data.layer_data.animation,
                            overlayStartTime: data.layer_data.startTime,
                            overlayEndTime: data.layer_data.endTime,
                            filePath: inputPath,
                            ffmpegTrimmedGif: 'ffmpeg_trimmed_gif' + '_' + Date.now() + '_' + data.sort_order + '.gif',
                        };
                        videoSegments.push(gifObject);
                    }
                }
                return videoSegments;
            }
            catch (error) {
                const err = {
                    videoSegment: []
                };
                err.videoSegment.push({
                    message: error.message,
                    code: error.code,
                    time: error.time
                });
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : create array to generate export video command
    🗓 @created : 18/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createCommandArray(videoSegments, productionExportUuid, quality, sequenceUuid, s3ObjectKey, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let awsTrimCommand = [];
                let trimCommand = [];
                const processedVideos = [];
                for (const segment of videoSegments) {
                    try {
                        if (segment.objectType === 'VIDEO') {
                            // Trim the video
                            try {
                                console.log("TRIM COMMAND STARTED");
                                var outputPath = path_1.default.join(__dirname, '../../../assets/local', segment.trimmedVideo);
                                const localFolderPath = path_1.default.join(__dirname, '../../../assets/local');
                                yield this.checkFolderExists(localFolderPath);
                                awsTrimCommand.push(`aws s3 cp s3://${constant_1.default.app.AWS_BUCKET_NAME}/${segment.filePath} /tmp/${segment.trimmedVideo}`);
                                trimCommand.push(`ffmpeg -i /tmp/${segment.trimmedVideo} -vf "scale=${segment.width}:${segment.height},pad=${segment.width}:${segment.height}:0:0" -c:v libx264 -preset slow -crf 21 -c:a aac -strict -2 /tmp/${segment.ffmpegTrimmedVideo}`);
                            }
                            catch (error) {
                                const err = {
                                    trimError: []
                                };
                                err.trimError.push({
                                    message: error.message,
                                    code: error.code,
                                    time: error.time
                                });
                                // await restApiService.failedStatusCall(err,productionExportUuid,sequenceUuid);
                                this.cleanTemporaryFiles(videoSegments);
                            }
                            //
                            //  get final position of x and y
                            //
                            const finalXPosition = segment.rLeft ? segment.rLeft : segment.left;
                            const animationTypes = segment.animation ? segment.animation.map((obj) => obj.animationType) : [];
                            if (animationTypes.includes('left-to-right')) {
                                var x = `'if(gte(t,${segment.start}),min((t-${segment.start})*200,${finalXPosition}),${finalXPosition})'`;
                            }
                            else if (animationTypes.includes('right-to-left')) {
                                var x = `'if(gte(t,${segment.start}),max(${quality.split('x')[0]}-${segment.width}-(t-${segment.start})*200,${finalXPosition}),${quality.split('x')[0]}-${segment.width})'`;
                            }
                            else {
                                var x = finalXPosition;
                            }
                            // Store information about the trimmed video for later use
                            processedVideos.push({
                                layer_type: "VIDEO",
                                source: `${outputPath}`,
                                position: {
                                    top: segment.top,
                                    left: x,
                                    scaleW: segment.width,
                                    scaleH: segment.height,
                                    padW: quality.split('x')[0],
                                    padH: quality.split('x')[1],
                                    rTop: segment.rTop,
                                    rLeft: segment.rLeft,
                                    rHeight: segment.rHeight,
                                    rWidth: segment.rWidth,
                                    rotation: segment.rotation
                                },
                                startTime: segment.start,
                                endTime: segment.end,
                                overlayStart: segment.overlayStartTime,
                                overlayEnd: segment.overlayEndTime,
                                animationType: animationTypes,
                                ffmpegSource: `/tmp/${segment.ffmpegTrimmedVideo}`
                            });
                        }
                        else if (segment.objectType === 'IMAGE') {
                            try {
                                var outputPath = path_1.default.join(__dirname, '../../../assets/local', segment.trimmedImage);
                                const localFolderPath = path_1.default.join(__dirname, '../../../assets/local');
                                yield this.checkFolderExists(localFolderPath);
                                awsTrimCommand.push(`aws s3 cp s3://${constant_1.default.app.AWS_BUCKET_NAME}/${segment.filePath} /tmp/${segment.trimmedImage}`);
                                // trimCommand.push(`ffmpeg -i /tmp/${segment.trimmedImage} -vf "loop=-1:1:0,trim=duration=${segment.duration},scale=${segment.width}:${segment.height},pad=${segment.width}:${segment.height}:color=0x00000000" -c:v libx264 -preset slow -crf 21 -c:a aac -strict -2 /tmp/${segment.ffmpegTrimmedImage}`)
                                // trimCommand.push(`ffmpeg -i /tmp/${segment.trimmedImage} -vf "loop=-1:1:0,trim=duration=${segment.duration},format=rgba,scale=${segment.width}:${segment.height}" -c:v libx264 -preset slow -crf 21 -c:a aac -strict -2 /tmp/${segment.ffmpegTrimmedImage}`)
                            }
                            catch (error) {
                                const err = {
                                    trimError: []
                                };
                                err.trimError.push({
                                    message: error.message,
                                    code: error.code,
                                    time: error.time
                                });
                                this.cleanTemporaryFiles(videoSegments);
                            }
                            //
                            //  get final position of x and y
                            //
                            const finalXPosition = segment.rLeft ? segment.rLeft : segment.left;
                            const animationTypes = segment.animation ? segment.animation.map((obj) => obj.animationType) : [];
                            if (animationTypes.includes('left-to-right')) {
                                var x = `'if(gte(t,${segment.start}),min((t-${segment.start})*200,${finalXPosition}),${finalXPosition})'`;
                            }
                            else if (animationTypes.includes('right-to-left')) {
                                var x = `'if(gte(t,${segment.start}),max(${quality.split('x')[0]}-${segment.width}-(t-${segment.start})*200,${finalXPosition}),${quality.split('x')[0]}-${segment.width})'`;
                            }
                            else {
                                var x = finalXPosition;
                            }
                            // Process image
                            // Implement logic to handle images here
                            processedVideos.push({
                                layer_type: "IMAGE",
                                source: `${outputPath}`,
                                position: {
                                    top: segment.top,
                                    left: x,
                                    scaleW: segment.width,
                                    scaleH: segment.height,
                                    padW: quality.split('x')[0],
                                    padH: quality.split('x')[1],
                                    rTop: segment.rTop,
                                    rLeft: segment.rLeft,
                                    rHeight: segment.rHeight,
                                    rWidth: segment.rWidth,
                                    rotation: segment.rotation
                                },
                                startTime: segment.start,
                                endTime: segment.end,
                                overlayStart: segment.overlayStartTime,
                                overlayEnd: segment.overlayEndTime,
                                animationType: animationTypes,
                                ffmpegSource: `/tmp/${segment.trimmedImage}`
                            });
                        }
                        else if (segment.objectType === 'TEXT') {
                            const animationTypes = segment.animation ? segment.animation.map((obj) => obj.animationType) : [];
                            if (animationTypes.includes('left-to-right')) {
                                var x = `'if(gte(t,${segment.start}),min((t-${segment.start})*200,${segment.x}),${segment.x})'`;
                            }
                            else if (animationTypes.includes('right-to-left')) {
                                var x = `'if(gte(t,${segment.start}),max(${quality.split('x')[0]}-${segment.width}-(t-${segment.start})*200,${segment.x}),${quality.split('x')[0]}-${segment.width})'`;
                            }
                            else {
                                var x = segment.x;
                            }
                            const awsFontFilePath = `${segment.fontfile}`;
                            const localFontFilePath = `font_${Date.now()}`;
                            awsTrimCommand.push(`aws s3 cp s3://${constant_1.default.app.AWS_BUCKET_NAME}/${segment.fontfile} /tmp/${segment.localPath}`);
                            // Process text
                            // Implement logic to handle text here
                            processedVideos.push({
                                layer_type: "TEXT",
                                text: segment.text,
                                position: {
                                    top: segment.y,
                                    left: x
                                },
                                startTime: segment.start,
                                endTime: segment.end,
                                font: segment.font,
                                fontsize: segment.fontsize,
                                fontcolor: segment.fontcolor,
                                fontfile: `/tmp/${segment.localPath}`,
                                animationType: animationTypes
                            });
                        }
                        else if (segment.objectType === 'AUDIO') {
                            try {
                                var outputPath = path_1.default.join(__dirname, '../../../assets/local', segment.trimmedAudio);
                                const localFolderPath = path_1.default.join(__dirname, '../../../assets/local');
                                yield this.checkFolderExists(localFolderPath);
                                awsTrimCommand.push(`aws s3 cp s3://${constant_1.default.app.AWS_BUCKET_NAME}/${segment.filePath} /tmp/${segment.trimmedAudio}`);
                                trimCommand.push(`ffmpeg -i /tmp/${segment.trimmedAudio} -ss ${segment.start} -t ${segment.duration} -c:a copy /tmp/${segment.ffmpegTrimmedAudio}`);
                            }
                            catch (error) {
                                const err = {
                                    trimError: []
                                };
                                err.trimError.push({
                                    message: error.message,
                                    code: error.code,
                                    time: error.time
                                });
                                this.cleanTemporaryFiles(videoSegments);
                            }
                            //
                            // Store information about the trimmed audio for later use
                            //
                            processedVideos.push({
                                layer_type: "AUDIO",
                                source: `${outputPath}`,
                                startTime: segment.start,
                                endTime: segment.end,
                                volume: segment.volume,
                                delay: segment.delay,
                                ffmpegSource: `/tmp/${segment.ffmpegTrimmedAudio}`
                            });
                        }
                        else if (segment.objectType === 'GIF') {
                            try {
                                var outputPath = path_1.default.join(__dirname, '../../../assets/local', segment.trimmedGif);
                                const localFolderPath = path_1.default.join(__dirname, '../../../assets/local');
                                yield this.checkFolderExists(localFolderPath);
                                awsTrimCommand.push(`aws s3 cp s3://${constant_1.default.app.AWS_BUCKET_NAME}/${segment.filePath} /tmp/${segment.trimmedGif}`);
                                trimCommand.push(`ffmpeg -i /tmp/${segment.trimmedGif} -c copy /tmp/${segment.ffmpegTrimmedGif}`);
                            }
                            catch (error) {
                                const err = {
                                    trimError: []
                                };
                                err.trimError.push({
                                    message: error.message,
                                    code: error.code,
                                    time: error.time
                                });
                                // await restApiService.failedStatusCall(err,productionExportUuid,sequenceUuid);
                                this.cleanTemporaryFiles(videoSegments);
                            }
                            //
                            //  get final position of x and y
                            //
                            const finalXPosition = segment.rLeft ? segment.rLeft : segment.left;
                            const animationTypes = segment.animation ? segment.animation.map((obj) => obj.animationType) : [];
                            if (animationTypes.includes('left-to-right')) {
                                var x = `'if(gte(t,${segment.start}),min((t-${segment.start})*200,${finalXPosition}),${finalXPosition})'`;
                            }
                            else if (animationTypes.includes('right-to-left')) {
                                var x = `'if(gte(t,${segment.start}),max(${quality.split('x')[0]}-${segment.width}-(t-${segment.start})*200,${finalXPosition}),${quality.split('x')[0]}-${segment.width})'`;
                            }
                            else {
                                var x = finalXPosition;
                            }
                            // Process image
                            // Implement logic to handle images here
                            processedVideos.push({
                                layer_type: "GIF",
                                source: `${outputPath}`,
                                position: {
                                    top: segment.top,
                                    left: x,
                                    scaleW: segment.width,
                                    scaleH: segment.height,
                                    padW: quality.split('x')[0],
                                    padH: quality.split('x')[1],
                                    rTop: segment.rTop,
                                    rLeft: segment.rLeft,
                                    rHeight: segment.rHeight,
                                    rWidth: segment.rWidth,
                                    rotation: segment.rotation
                                },
                                startTime: segment.start,
                                endTime: segment.end,
                                overlayStart: segment.overlayStartTime,
                                overlayEnd: segment.overlayEndTime,
                                animationType: animationTypes,
                                ffmpegSource: `/tmp/${segment.ffmpegTrimmedGif}`
                            });
                        }
                    }
                    catch (error) {
                        console.log("Error from processing command");
                        console.log(error);
                    }
                }
                var outputPath = path_1.default.join(__dirname, '../../../assets/output');
                const outputFolderPath = path_1.default.join(__dirname, '../../../assets/output');
                yield this.checkFolderExists(outputFolderPath);
                // Call generateFFmpegCommand with the processed videos
                const outputFilePath = `${outputPath}/output_video_${Date.now()}.mp4`;
                // Combine both arrays
                const allCommands = [...awsTrimCommand, ...trimCommand];
                // Join them with ' && ' to create a single string
                const finalCommandAwsTrim = allCommands.join(' && ');
                yield this.generateFFmpegCommand(processedVideos, outputFilePath, quality, productionExportUuid, videoSegments, sequenceUuid, finalCommandAwsTrim, s3ObjectKey, body);
                //
                // Clean up temporary files if needed
                //
                yield this.cleanTemporaryFiles(videoSegments);
                return outputFilePath;
            }
            catch (error) {
                const err = {
                    videoSegment: []
                };
                err.videoSegment.push({
                    message: error.message,
                    code: error.code,
                    time: error.time
                });
                this.cleanTemporaryFiles(videoSegments);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate ffmpeg command
    🗓 @created : 18/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateFFmpegCommand(data, outputFilePath, quality, productionExportUuid, videoSegments, sequenceUuid, finalCommandAwsTrim, s3ObjectKey, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                //  find the largest end time
                //
                const largestEndTime = data.reduce((maxEndTime, layer) => Math.max(maxEndTime, layer.endTime), 0);
                let filterComplex = '';
                let inputFiles = '';
                let overlayIndex = 1;
                let overlayArray = [];
                let scaleNumber = 0;
                const mediaType = 'bg';
                const mediaLabel = `[${mediaType}]`;
                let scaleExpression = `scale=${quality.split('x')[0]}:${quality.split('x')[1]}`;
                filterComplex += `[${scaleNumber}:v]${scaleExpression}${mediaLabel}; `;
                // overlayIndex++;
                // inputFiles += `-f lavfi -i color=c=black:s=${quality.split('x')[0]}x${quality.split('x')[1]}:d=${largestEndTime} `;
                inputFiles += `-f lavfi -i color=c=black@0:s=${quality.split('x')[0]}x${quality.split('x')[1]}:d=${largestEndTime} -t ${largestEndTime} `;
                var overlayData = {};
                overlayData[mediaLabel] = {
                    x: '1280',
                    y: '720',
                    startTime: '0',
                    endTime: '40',
                    object_type: mediaType
                };
                overlayArray.push(overlayData);
                scaleNumber++;
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (item.layer_type === 'VIDEO' || item.layer_type === 'IMAGE') {
                        const mediaType = item.layer_type === 'VIDEO' ? 'video' : 'image';
                        const mediaLabel = `[${mediaType}${i}]`;
                        const rotationDegree = item.position.rotation ? item.position.rotation : 0;
                        const outputWidth = item.position.rWidth ? item.position.rWidth : item.position.scaleW;
                        const outputHeight = item.position.rHeight ? item.position.rHeight : item.position.scaleH;
                        if (item.layer_type == 'VIDEO') {
                            if (item.animationType.includes('fade-in') && item.animationType.includes('fade-out')) {
                                scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},trim=start=${item.startTime}:end=${item.endTime},setpts=PTS-STARTPTS+${item.overlayStart}/TB,fade=in:st=${item.overlayStart},fade=out:st=${item.overlayEnd - 1}`;
                            }
                            else if (item.animationType.includes('fade-in')) {
                                scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},trim=start=${item.startTime}:end=${item.endTime},setpts=PTS-STARTPTS+${item.overlayStart}/TB,fade=in:st=${item.overlayStart}`;
                            }
                            else if (item.animationType.includes('fade-out')) {
                                scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},trim=start=${item.startTime}:end=${item.endTime},setpts=PTS-STARTPTS+${item.overlayStart}/TB,fade=out:st=${item.overlayEnd - 1}`;
                            }
                            else {
                                scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},trim=start=${item.startTime}:end=${item.endTime},setpts=PTS-STARTPTS+${item.overlayStart}/TB`;
                            }
                        }
                        else {
                            if (item.animationType.includes('fade-in') && item.animationType.includes('fade-out')) {
                                scaleExpression = `format=rgba,scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=in:st=${item.overlayStart}:alpha=1,fade=t=out:st=${item.overlayEnd - 1}:d=1:alpha=1`;
                            }
                            else if (item.animationType.includes('fade-in')) {
                                scaleExpression = `format=rgba,scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=in:st=${item.overlayStart}:alpha=1`;
                            }
                            else if (item.animationType.includes('fade-out')) {
                                scaleExpression = `format=rgba,scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=out:st=${item.overlayEnd - 1}:d=1:alpha=1`;
                            }
                            else {
                                scaleExpression = `format=rgba,scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight}`;
                            }
                        }
                        filterComplex += `[${scaleNumber}:v]${scaleExpression}${mediaLabel}; `;
                        if (item.layer_type == 'VIDEO') {
                            inputFiles += `-i "${item.ffmpegSource}" `;
                        }
                        else {
                            inputFiles += `-loop 1 -i "${item.ffmpegSource}" `;
                        }
                        var overlayData = {};
                        overlayData[mediaLabel] = {
                            x: item.position.left,
                            y: item.position.top,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            object_type: mediaType,
                            rotateX: item.position.rLeft,
                            rotateY: item.position.rTop,
                            overlayStart: item.overlayStart,
                            overlayEnd: item.overlayEnd
                        };
                        overlayArray.push(overlayData);
                        scaleNumber++;
                    }
                    else if (item.layer_type === 'TEXT') {
                        const textLabel = `[text${i}]`;
                        var overlayData = {};
                        overlayData[textLabel] = {
                            text: item.text,
                            x: item.position.left,
                            y: item.position.top,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            object_type: 'text',
                            fontcolor: item.fontcolor,
                            fontsize: item.fontsize,
                            font: item.font,
                            fontfile: item.fontfile,
                            animation: item.animationType
                        };
                        overlayArray.push(overlayData);
                    }
                    else if (item.layer_type === 'AUDIO') {
                        const audioLabel = `[audio${i}]`;
                        const audioExpression = `volume=${item.volume},adelay=${item.delay}|${item.delay}`;
                        filterComplex += `[${scaleNumber}:a]${audioExpression}${audioLabel}; `;
                        inputFiles += `-i "${item.ffmpegSource}" `;
                        var overlayData = {};
                        overlayData[audioLabel] = {
                            startTime: item.startTime,
                            endTime: item.endTime,
                            object_type: 'audio'
                        };
                        overlayArray.push(overlayData);
                        scaleNumber++;
                    }
                    else if (item.layer_type === 'GIF') {
                        const gifLabel = `[gif${i}]`;
                        const rotationDegree = item.position.rotation ? item.position.rotation : 0;
                        const outputWidth = item.position.rWidth ? item.position.rWidth : item.position.scaleW;
                        const outputHeight = item.position.rHeight ? item.position.rHeight : item.position.scaleH;
                        if (item.animationType.includes('fade-in') && item.animationType.includes('fade-out')) {
                            scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=in:st=${item.overlayStart}:alpha=1,fade=t=out:st=${item.overlayEnd - 1}:alpha=1`;
                        }
                        else if (item.animationType.includes('fade-in')) {
                            scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=in:st=${item.overlayStart}:alpha=1`;
                        }
                        else if (item.animationType.includes('fade-out')) {
                            scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight},fade=t=out:st=${item.overlayEnd - 1}:alpha=1`;
                        }
                        else {
                            scaleExpression = `scale=${item.position.scaleW}:${item.position.scaleH},rotate=${rotationDegree}*PI/180:c=none:ow=${outputWidth}:oh=${outputHeight}`;
                        }
                        filterComplex += `[${scaleNumber}:v]${scaleExpression}${gifLabel}; `;
                        inputFiles += `-stream_loop -1 -i "${item.ffmpegSource}" `;
                        var overlayData = {};
                        overlayData[gifLabel] = {
                            x: item.position.left,
                            y: item.position.top,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            object_type: 'gif',
                            rotateX: item.position.rLeft,
                            rotateY: item.position.rTop,
                            overlayStart: item.overlayStart,
                            overlayEnd: item.overlayEnd
                        };
                        overlayArray.push(overlayData);
                        scaleNumber++;
                    }
                }
                // Remove audio objects and create a new array of audio objects
                const audioObjects = overlayArray.filter((item) => {
                    const key = Object.keys(item)[0];
                    return key.includes('[audio');
                });
                // Remove audio objects from the original array
                const newArrayWithoutAudio = overlayArray.filter((item) => {
                    const key = Object.keys(item)[0];
                    return !key.includes('[audio');
                });
                let overlayCmd = '';
                for (let j = 0; j < newArrayWithoutAudio.length - 1; j++) {
                    const overlayItem = newArrayWithoutAudio[j];
                    const overlayKeys = Object.keys(overlayItem);
                    const overlayItem1 = newArrayWithoutAudio[j + 1];
                    const overlayKeysOne = Object.keys(overlayItem1);
                    const x = overlayItem1[overlayKeysOne].x !== undefined ? overlayItem1[overlayKeysOne].x : overlayItem1[overlayKeysOne].rotateX;
                    const y = overlayItem1[overlayKeysOne].rotateY ? overlayItem1[overlayKeysOne].rotateY : overlayItem1[overlayKeysOne].y;
                    const lastIndex = newArrayWithoutAudio.length - 1;
                    if (j == 0) {
                        if (newArrayWithoutAudio.length > 2) {
                            const ovelayLabel = `[tmp${j}]`;
                            const overlayName = `[tmp${j - 1}]`;
                            if (overlayItem1[overlayKeysOne].object_type == 'text') {
                                if (overlayItem1[overlayKeysOne].animation.includes('fade-in') && overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0))':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                                }
                                else if (overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                                }
                                else if (overlayItem1[overlayKeysOne].animation.includes('fade-in')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),1)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                                }
                                else {
                                    overlayCmd += `${overlayKeys}drawtext=text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                                }
                            }
                            else {
                                overlayCmd += `${overlayKeys}${overlayKeysOne}overlay=x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].overlayStart},${overlayItem1[overlayKeysOne].overlayEnd})'${ovelayLabel};`;
                            }
                        }
                        else {
                            const ovelayLabel = `[out]`;
                            if (overlayItem1[overlayKeysOne].object_type == 'text') {
                                if (overlayItem1[overlayKeysOne].animation.includes('fade-in') && overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0))':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                                }
                                else if (overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                                }
                                else if (overlayItem1[overlayKeysOne].animation.includes('fade-in')) {
                                    overlayCmd += `${overlayKeys}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),1)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                                }
                                else {
                                    overlayCmd += `${overlayKeys}drawtext=text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile},pad=${quality.split('x')[0]}:${quality.split('x')[1]}${ovelayLabel}`;
                                }
                            }
                            else {
                                overlayCmd += `${overlayKeys}${overlayKeysOne}overlay=x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].overlayStart},${overlayItem1[overlayKeysOne].overlayEnd})',pad=${quality.split('x')[0]}:${quality.split('x')[1]}${ovelayLabel}`;
                            }
                        }
                    }
                    else if (j != 0 && j != lastIndex - 1) {
                        const ovelayLabel = `[tmp${j}]`;
                        const overlayName = `[tmp${j - 1}]`;
                        if (overlayItem1[overlayKeysOne].object_type == 'text') {
                            if (overlayItem1[overlayKeysOne].animation.includes('fade-in') && overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0))':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                            }
                            else if (overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                            }
                            else if (overlayItem1[overlayKeysOne].animation.includes('fade-in')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),1)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel};`;
                            }
                            else {
                                overlayCmd += `${overlayName}drawtext=text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime}):fontfile=${overlayItem1[overlayKeysOne].fontfile}'${ovelayLabel};`;
                            }
                        }
                        else {
                            overlayCmd += `${overlayName}${overlayKeysOne}overlay=x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].overlayStart},${overlayItem1[overlayKeysOne].overlayEnd})'${ovelayLabel};`;
                        }
                    }
                    else {
                        const ovelayLabel = `[out]`;
                        const overlayName = `[tmp${j - 1}]`;
                        if (overlayItem1[overlayKeysOne].object_type == 'text') {
                            if (overlayItem1[overlayKeysOne].animation.includes('fade-in') && overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0))':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                            }
                            else if (overlayItem1[overlayKeysOne].animation.includes('fade-out')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].endTime}),1-(t-${overlayItem1[overlayKeysOne].endTime - 1}),0)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                            }
                            else if (overlayItem1[overlayKeysOne].animation.includes('fade-in')) {
                                overlayCmd += `${overlayName}drawtext=alpha='if(lt(t,${overlayItem1[overlayKeysOne].startTime + 2}),(t-${overlayItem1[overlayKeysOne].startTime}),1)':text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile}${ovelayLabel}`;
                            }
                            else {
                                overlayCmd += `${overlayName}drawtext=text='${overlayItem1[overlayKeysOne].text}':fontcolor=${overlayItem1[overlayKeysOne].fontcolor}:fontsize=${overlayItem1[overlayKeysOne].fontsize}:x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].startTime},${overlayItem1[overlayKeysOne].endTime})':fontfile=${overlayItem1[overlayKeysOne].fontfile},pad=${quality.split('x')[0]}:${quality.split('x')[1]}${ovelayLabel}`;
                            }
                        }
                        else {
                            overlayCmd += `${overlayName}${overlayKeysOne}overlay=x=${x}:y=${y}:enable='between(t,${overlayItem1[overlayKeysOne].overlayStart},${overlayItem1[overlayKeysOne].overlayEnd})',pad=${quality.split('x')[0]}:${quality.split('x')[1]}${ovelayLabel}`;
                        }
                    }
                }
                const finalCommand = filterComplex.concat(overlayCmd);
                if (audioObjects && audioObjects.length >= 1 && newArrayWithoutAudio.length > 1) {
                    const audioKey = audioObjects.map((item) => Object.keys(item)[0]).join('');
                    var command = `ffmpeg ${inputFiles}-filter_complex "${finalCommand};${audioKey}amix=${audioObjects.length}[aout]" -map "[out]" -map "[aout]" -b:v 128k -ac 2 -preset slow -crf 21 -t ${largestEndTime} /tmp/output_video.mp4 && aws s3 cp /tmp/output_video.mp4 s3://${constant_1.default.app.AWS_BUCKET_NAME}/${s3ObjectKey}`;
                }
                else if (audioObjects && audioObjects.length >= 1 && newArrayWithoutAudio.length == 1) {
                    const audioKey = audioObjects.map((item) => Object.keys(item)[0]).join('');
                    var command = `ffmpeg ${inputFiles}-filter_complex "${finalCommand}${audioKey}amix=${audioObjects.length}[aout]" -map "[bg]" -map "[aout]" -b:v 128k -ac 2 -preset slow -crf 21 -t ${largestEndTime} /tmp/output_video.mp4 && aws s3 cp /tmp/output_video.mp4 s3://${constant_1.default.app.AWS_BUCKET_NAME}/${s3ObjectKey}`;
                }
                else {
                    // Execute ffmpeg command
                    var command = `ffmpeg ${inputFiles}-filter_complex "${finalCommand}" -map "[out]" -b:v 128k -preset slow -crf 21 -t ${largestEndTime} /tmp/output_video.mp4 && aws s3 cp /tmp/output_video.mp4 s3://${constant_1.default.app.AWS_BUCKET_NAME}/${s3ObjectKey}`;
                }
                if (finalCommandAwsTrim) {
                    var jobCommand = `${finalCommandAwsTrim} && ${command}`;
                }
                else {
                    var jobCommand = `${command}`;
                }
                console.log("====================jobcommand ===================");
                console.log(JSON.stringify(jobCommand));
                // var jobCommand = `
                //                     aws s3 cp s3://video-fredo-dev/cm_8055632c_8236_4ef3_b59a_c1b700f2df7e/library/us_9ca4d09a_6759_4691_8872_9858a4e8fa3e/9756867/9756867.mp4 /tmp/trimmed_video_1736508049417_1.mp4 && \
                //                     aws s3 cp s3://video-fredo-dev/cm_8055632c_8236_4ef3_b59a_c1b700f2df7e/library/us_9ca4d09a_6759_4691_8872_9858a4e8fa3e/9756867/audio1735916955369.mp3 /tmp/trimmed_audio_1736508049424_2.mp3 && \
                //                     aws s3 cp s3://video-fredo-dev/cm_8055632c_8236_4ef3_b59a_c1b700f2df7e/library/us_857842a0_c4ea_4b59_9f37_a269fb2795d6/8691758/8691758.png /tmp/trimmed_image_1736508049425_3.png && \
                //                     aws s3 cp s3://video-fredo-dev/cm_8055632c_8236_4ef3_b59a_c1b700f2df7e/library/us_857842a0_c4ea_4b59_9f37_a269fb2795d6/2074877/2074877.png /tmp/trimmed_image_1736508049425_4.png && \
                //                     ffmpeg -i /tmp/trimmed_video_1736508049417_1.mp4 -vf "scale=904:510,pad=904:510:0:0" -c:v libx264 -preset slow -crf 21 -c:a aac -strict -2 /tmp/ffmpeg_trimmed_video_1736508049417_1.mp4 && \
                //                     ffmpeg -i /tmp/trimmed_audio_1736508049424_2.mp3 -ss 0 -t 9 -c:a copy /tmp/ffmpeg_trimmed_audio_1736508049424_2.mp3 && \
                //                     ffmpeg -f lavfi -i color=c=black@0:s=1280x720:d=10 -framerate 25 -t 10 \
                //                     -i /tmp/ffmpeg_trimmed_video_1736508049417_1.mp4 \
                //                     -i /tmp/ffmpeg_trimmed_audio_1736508049424_2.mp3 \
                //                     -loop 1 -i /tmp/trimmed_image_1736508049425_3.png \
                //                     -loop 1 -i /tmp/trimmed_image_1736508049425_4.png \
                //                     -filter_complex "[0:v]scale=1280:720[bg]; \
                //                     [1:v]scale=904:510,rotate=0*PI/180:c=none:ow=906:oh=510,trim=start=0:end=9,setpts=PTS-STARTPTS[video0]; \
                //                     [2:a]volume=0.5,adelay=0|0[audio1]; \
                //                     [3:v]format=rgba,scale=222:222,rotate=0*PI/180[image2]; \
                //                     [4:v]format=rgba,scale=214:214,rotate=0*PI/180[image3]; \
                //                     [bg][video0]overlay=x=185:y=108:enable='between(t,0,9)'[tmp0]; \
                //                     [tmp0][image2]overlay=x=842.23:y=114.47:enable='between(t,0,10)'[tmp1]; \
                //                     [tmp1][image3]overlay=x=227.75:y=370.51:enable='between(t,0,10)',pad=1280:720[out]; \
                //                     [audio1]amix=inputs=1[aout]" \
                //                     -map "[out]" -map "[aout]" -b:v 128k -ac 2 -preset slow -crf 21 -t 10 /tmp/output_video.mp4 && \
                //                     aws s3 cp /tmp/output_video.mp4 s3://video-fredo-dev/cm_8055632c_8236_4ef3_b59a_c1b700f2df7e/production/production_7e018833_6e7a_4176_8cfb_450e1cd4b122/export/export_1736508053552.mp4
                //                 `
                const exportBatch = yield awsBatch_service_1.default.exportVideoViaJob(jobCommand, body);
                if (exportBatch) {
                    //
                    //  prepare data model to save the aws bact job details
                    //
                    const jobDetailsDataModel = {
                        job_id: exportBatch.jobId,
                        status: constant_1.default.job_status.IN_PROCESS,
                        name: s3ObjectKey,
                        type: 'EXPORT_VIDEO',
                        user_uuid: body.user_uuid ? body.user_uuid : null,
                        company_uuid: body.company_uuid ? body.company_uuid : null,
                        production_export_uuid: body.production_export_uuid,
                        sequence_uuid: body.sequence_uuid,
                        created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
                    };
                    //
                    //  save job details
                    //
                    const videoDetailsBatchUuid = yield video_repo_1.default.saveJobDetails(jobDetailsDataModel);
                }
                return exportBatch;
            }
            catch (error) {
                const err = {
                    cmdErr: []
                };
                err.cmdErr.push({
                    message: error.message,
                    code: error.code,
                    time: error.time
                });
                this.cleanTemporaryFiles(videoSegments);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : clean temporary files
    🗓 @created : 30/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    cleanTemporaryFiles(videoSegments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var clearLocalPath = path_1.default.join(__dirname, '../../../assets/local');
                for (const segment of videoSegments) {
                    if (segment.objectType === 'VIDEO') {
                        fs_1.default.unlinkSync(`${clearLocalPath}/${segment.trimmedVideo}`);
                    }
                    if (segment.objectType === 'IMAGE') {
                        fs_1.default.unlinkSync(`${clearLocalPath}/${segment.trimmedImage}`);
                    }
                    if (segment.objectType === 'AUDIO') {
                        fs_1.default.unlinkSync(`${clearLocalPath}/${segment.trimmedAudio}`);
                    }
                    if (segment.objectType === 'GIF') {
                        fs_1.default.unlinkSync(`${clearLocalPath}/${segment.trimmedGif}`);
                    }
                }
            }
            catch (error) {
                console.log("=====UNLINK ERROR====");
                // console.log(error);
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
exports.default = new ExportService();
//# sourceMappingURL=export.service.js.map