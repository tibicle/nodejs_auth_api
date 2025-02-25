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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import validations
// Import Transformers
// Import Libraries
const aws_1 = __importDefault(require("../../library/aws"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const randomstring_1 = __importDefault(require("randomstring"));
const checkEmbedCode_service_1 = __importDefault(require("../../app/export/services/checkEmbedCode.service"));
const updateExportHlsData_service_1 = __importDefault(require("../../app/export/services/updateExportHlsData.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete font file which is used while generating video
🗓 @created : 29/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createHlsVideo = (tempExportPath, tempExportFolder, tempExportUuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  Media convert endpoint
        //
        const endpoint = `https://mediaconvert.${constant_1.default.app.AWS_BUCKET_REGION}.amazonaws.com`;
        //
        //  Aws media convert endpoint
        //
        const mediaconvert = new aws_sdk_1.default.MediaConvert({ endpoint: endpoint });
        //
        //  IAM role for MediaConvert (replace with your MediaConvert role ARN)
        // 
        const mediaConvertRole = constant_1.default.app.AWS_IAM_ROLE;
        //
        //  Input MP4 file S3 location and output HLS S3 location
        //
        const inputS3Url = `s3://${process.env.AWS_BUCKET_NAME}/${tempExportPath}`;
        //
        //  Bucket name
        //
        const bucketName = `${process.env.AWS_BUCKET_NAME}`;
        //
        //  create export folder
        //
        const exportData = `${constant_1.default.folder.OUTPUT_HLS}_${tempExportUuid}`;
        const exportFolder = `${tempExportFolder}${exportData}/`;
        let hlsVideoFolderCreate = yield aws_1.default.checkAndCreateFolder(bucketName, exportFolder);
        //
        //  Output HLS S3 location
        //
        const outputS3Url = `s3://${process.env.AWS_BUCKET_NAME}/${hlsVideoFolderCreate}`;
        //
        //  HLS processing
        //
        const params = {
            Queue: constant_1.default.app.AWS_MEDIACONVERT_QUEUE,
            UserMetadata: {},
            Role: mediaConvertRole,
            Settings: {
                OutputGroups: [
                    {
                        Name: 'HLS Group',
                        OutputGroupSettings: {
                            Type: 'HLS_GROUP_SETTINGS',
                            HlsGroupSettings: {
                                SegmentLength: 10,
                                Destination: outputS3Url,
                                ManifestDurationFormat: 'INTEGER',
                                MinSegmentLength: 0,
                                SegmentControl: 'SEGMENTED_FILES',
                                StreamInfResolution: 'INCLUDE',
                                DestinationSettings: {
                                    S3Settings: {}
                                }
                            }
                        },
                        Outputs: [
                            {
                                NameModifier: '_hls',
                                VideoDescription: {
                                    CodecSettings: {
                                        Codec: 'H_264',
                                        H264Settings: {
                                            Bitrate: 1024000,
                                            RateControlMode: 'CBR',
                                            GopSize: 2,
                                            GopClosedCadence: 1
                                        }
                                    },
                                    Height: 1080,
                                    Width: 1920
                                },
                                AudioDescriptions: [
                                    {
                                        CodecSettings: {
                                            Codec: 'AAC',
                                            AacSettings: {
                                                Bitrate: 64000,
                                                CodingMode: 'CODING_MODE_2_0',
                                                SampleRate: 48000
                                            }
                                        }
                                    }
                                ],
                                ContainerSettings: {
                                    Container: 'M3U8'
                                }
                            }
                        ]
                    }
                ],
                Inputs: [
                    {
                        FileInput: inputS3Url,
                        AudioSelectors: {
                            'Audio Selector 1': {
                                DefaultSelection: 'DEFAULT'
                            }
                        },
                        VideoSelector: {},
                        TimecodeSource: 'EMBEDDED'
                    }
                ]
            }
        };
        try {
            //
            //  Get response of HLS
            //
            const response = yield mediaconvert.createJob(params).promise();
            //
            //  create unique embed code
            //
            yield generateUniqueCode(response.Job.Id, tempExportUuid);
        }
        catch (err) {
            console.log('Error creating MediaConvert job:', err);
        }
    }
    catch (error) {
        console.log(`Error deleting directory: ${error.message}`);
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : total job in a queue
🗓 @created : 29/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const generateUniqueCode = (jobId, tempExportUuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  generate 8 digit unique code 
        //
        let uniqueCode = createUniqueCode();
        //
        //  api to check if unique code is already exist or not
        //
        let data = yield (0, checkEmbedCode_service_1.default)(uniqueCode);
        while (data === true) {
            //
            // Generate a new unique code
            //
            uniqueCode = createUniqueCode();
            //
            // Check if the new code exists
            //
            data = yield (0, checkEmbedCode_service_1.default)(uniqueCode);
        }
        //
        //  if not then update else generate new code.
        //
        yield (0, updateExportHlsData_service_1.default)(tempExportUuid, uniqueCode, jobId);
    }
    catch (error) {
        console.error('Error checking job status:', error.message);
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create unique code
🗓 @created : 29/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createUniqueCode = () => {
    return randomstring_1.default.generate({
        length: 8,
        charset: 'alphanumeric',
    });
};
exports.default = createHlsVideo;
//# sourceMappingURL=hlsVideoCreate.service.js.map