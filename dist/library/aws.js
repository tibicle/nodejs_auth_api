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
// Import Config
const constant_1 = __importDefault(require("../config/constant"));
const awsS3_1 = __importDefault(require("../config/awsS3"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Validators
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const fs_extra_1 = __importDefault(require("fs-extra"));
class Aws {
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to check the permission agaist user and action code
    * 🗓 Created : 23/4/2022
    */
    getSignedUrl(bucket, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield awsS3_1.default.getSignedUrl('getObject', {
                    Bucket: bucket,
                    Key: key,
                    Expires: 3600,
                    ResponseContentType: 'application/pdf',
                    ResponseContentDisposition: 'attachment'
                });
                return url;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to delete the file from s3
    * 🗓 Created : 27/6/2022
    */
    deleteFile(bucket, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var params = { Bucket: bucket, Key: key };
                //
                // delete the object
                //
                const data = yield awsS3_1.default.deleteObject(params).promise();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    /*============================
    😎 @author: Henil Mehta
    🚩 @uses: upload base64 image to s3
    🗓 @created: 15/09/2022
    ============================*/
    uploadBase64Image(bucket, key, base64EncodedImage, extension) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                // upload the file
                //
                const uploadedFile = yield awsS3_1.default.upload({
                    Bucket: bucket,
                    Key: key,
                    Body: base64EncodedImage,
                    ContentType: `image/${extension}`,
                    ContentEncoding: "base64"
                }).promise();
                return uploadedFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to upload pdf in s3 bucket
    🗓 @created : 02/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    uploadPDFToS3(bucket, key, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileContent = fs_extra_1.default.readFileSync(filePath);
                const pdfFile = yield awsS3_1.default.upload({
                    Bucket: bucket,
                    Key: key,
                    Body: fileContent,
                    ContentType: 'application/pdf',
                    ACL: 'public-read' // Set the access control policy (optional)
                }).promise();
                return pdfFile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get pre signed url to upload file
    🗓 @created : 09/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getPreSignedUrl(bucket, key, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get signed URL from S3
                const s3Params = {
                    Bucket: bucket,
                    Key: key,
                    Expires: parseInt(`${constant_1.default.expiration_time.PRE_SIGNED_URL}`),
                    ContentType: type
                };
                let uploadURL = awsS3_1.default.getSignedUrl('putObject', s3Params);
                return uploadURL;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get signed url
    🗓 @created : 08/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getImageSignedUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Params = {
                    Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
                    Key: key,
                    Expires: 36000
                };
                let uploadURL = awsS3_1.default.getSignedUrl('getObject', s3Params);
                return uploadURL;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check and create folder
    🗓 @created : 21/03/2024
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
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete folder from s3
    🗓 @created : 09/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteFolder(bucket, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isTruncated = true;
                let continuationToken = null;
                // const params = {
                //     Bucket: bucket,
                //     Prefix: key
                // };
                // const data:any = await s3.listObjectsV2(params).promise();
                // const objects = data.Contents.map((obj:any) => ({ Key: obj.Key }));
                // if (objects.length === 0) {
                //     console.log('Folder is already empty.');
                //     return;
                // }
                // const deleteParams = {
                //     Bucket: bucket,
                //     Delete: { Objects: objects }
                // };
                // const deleteData:any = await s3.deleteObjects(deleteParams).promise();
                // console.log(`${deleteData.Deleted.length} objects deleted from folder: ${key}`);
                // return true
                while (isTruncated) {
                    const params = {
                        Bucket: bucket,
                        Prefix: key,
                        ContinuationToken: continuationToken // For pagination
                    };
                    const data = yield awsS3_1.default.listObjectsV2(params).promise();
                    if (!data.Contents || data.Contents.length === 0) {
                        console.log('Folder is already empty.');
                        return false; // Indicate folder is already empty
                    }
                    const objects = data.Contents.map((obj) => ({ Key: obj.Key }));
                    const deleteParams = {
                        Bucket: bucket,
                        Delete: { Objects: objects }
                    };
                    const deleteData = yield awsS3_1.default.deleteObjects(deleteParams).promise();
                    console.log(`${deleteData.Deleted.length} objects deleted from folder: ${key}`);
                    // Check for more objects
                    isTruncated = data.IsTruncated;
                    continuationToken = data.NextContinuationToken; // For next batch
                }
                return true;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check folder exist or not
    🗓 @created : 02/01/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    doesFolderExist(bucket, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!folder.endsWith('/')) {
                folder += '/';
            }
            const params = {
                Bucket: bucket,
                Prefix: folder,
                MaxKeys: 1,
            };
            try {
                const data = yield awsS3_1.default.listObjectsV2(params).promise();
                return data.Contents && data.Contents.length > 0;
            }
            catch (error) {
                console.error("Error checking folder existence:", error);
            }
        });
    }
    ;
}
exports.default = new Aws();
//# sourceMappingURL=aws.js.map