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
// Import Thirdparty
class CalculateS3FolderSize {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get the library folder path
    🗓 @created : 28/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    calculateSize(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let totalSize = 0;
                const listObjectsResponse = yield awsS3_1.default.listObjectsV2({
                    Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
                    Prefix: `${folder}`,
                }).promise();
                for (const object of listObjectsResponse.Contents) {
                    const headObjectResponse = yield awsS3_1.default.headObject({
                        Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
                        Key: object.Key,
                    }).promise();
                    totalSize += headObjectResponse.ContentLength;
                }
                // console.log(`Total size of folder ${'bhavya'} in bucket ${'bucketName'}: ${totalSize} bytes`);
                return totalSize;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new CalculateS3FolderSize();
//# sourceMappingURL=calculateFolderSize.helper.js.map