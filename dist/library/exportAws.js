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
const awsS3_1 = __importDefault(require("../config/awsS3"));
class ExportAws {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get pre signed url
    🗓 @created : 18/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSignedUrl(key, productionExportUuid, sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Params = {
                    Bucket: `${process.env.AWS_BUCKET_NAME}`,
                    Key: key,
                    Expires: 36000
                };
                let uploadURL = awsS3_1.default.getSignedUrl('getObject', s3Params);
                return uploadURL;
            }
            catch (error) {
                const err = {
                    signedUrlErr: []
                };
                err.signedUrlErr.push({
                    message: error.message,
                    code: error.code,
                    time: error.time
                });
                // await restApiService.failedStatusCall(err,productionExportUuid,sequenceUuid);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : upload video to s3
    🗓 @created : 18/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    s3Upload(key, body, productionExportUuid, sequenceUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Bucket = `${process.env.AWS_BUCKET_NAME}`;
                const uploadParams = {
                    Bucket: s3Bucket,
                    Key: key,
                    Body: body,
                };
                const uploadFile = yield awsS3_1.default.upload(uploadParams).promise();
                return uploadFile;
            }
            catch (error) {
                const err = {
                    s3UploadErr: []
                };
                err.s3UploadErr.push({
                    message: error.message,
                    code: error.code,
                    time: error.time
                });
                // await restApiService.failedStatusCall(err,productionExportUuid,sequenceUuid);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check and create folder
    🗓 @created : 27/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkAndCreateFolder(bucket, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folderExists = yield awsS3_1.default.headObject({ Bucket: bucket, Key: folder }).promise().then(() => true).catch(() => false);
                if (!folderExists) {
                    yield awsS3_1.default.putObject({ Bucket: bucket, Key: folder }).promise();
                }
                // Define the key with the folder path and filename
                const key = `${folder}`;
                return key;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ExportAws();
//# sourceMappingURL=exportAws.js.map