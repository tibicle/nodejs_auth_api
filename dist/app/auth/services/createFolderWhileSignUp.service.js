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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Helpers
// Import Transformers
// Import Libraries
const aws_1 = __importDefault(require("../../../library/aws"));
// Import Repos
// Import Thirdparty
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create folder into s3 bucket
🗓 @created : 21/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createFolder = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user }, derived: { userDetails, companyDetails } } = container;
        if (body.organization_name) {
            const bucketName = constant_1.default.app.AWS_BUCKET_NAME;
            const userUuid = userDetails.uuid.replace(/-/g, '_');
            const companyUuid = companyDetails.uuid.replace(/-/g, '_');
            // if(companyDetails.name.includes(" ")){
            //   var companyName = companyDetails.name.replace(/\s/g, '');
            // }else{
            //   var companyName = companyDetails.name
            // }
            var companyName = constant_1.default.folder_prefix.COMPANY;
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            const companyFolder = `${companyName}_${companyUuid}/`;
            //
            //  create folder with self name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, selfFolder);
            //
            //  create folder with organization name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, companyFolder);
        }
        else {
            const bucketName = constant_1.default.app.AWS_BUCKET_NAME;
            const userUuid = userDetails.uuid.replace(/-/g, '_');
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            //
            //  create folder with self name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, selfFolder);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createFolder;
//# sourceMappingURL=createFolderWhileSignUp.service.js.map