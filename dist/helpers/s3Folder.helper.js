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
// Import Static
// Import Middleware
// Import Controllers
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
const company_repos_1 = __importDefault(require("../app/company/repos/company.repos"));
const user_repo_1 = __importDefault(require("../app/user/repos/user.repo"));
// Import Thirdparty
class S3Folder {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get the library folder path
    🗓 @created : 28/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFolderPath(companyUuid, userUuuid, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (companyUuid) {
                    //
                    //  get company details by uuid
                    //
                    const companyDetails = yield company_repos_1.default.checkCompanyExists(companyUuid);
                    //
                    //  get user details by uuid
                    //
                    const userDetails = yield user_repo_1.default.getUserByUuid(userUuuid);
                    const companyUuidFile = companyDetails.uuid.replace(/-/g, '_');
                    const userUuidFile = userDetails.uuid.replace(/-/g, '_');
                    // if(companyDetails.name.includes(" ")){
                    // var companyName = companyDetails.name.replace(/\s/g, '');
                    // }else{
                    var companyName = constant_1.default.folder_prefix.COMPANY;
                    // }  
                    let folderName;
                    if (name !== null) {
                        folderName = name.split(".");
                    }
                    //
                    //  create folder structure and return the file name
                    //
                    let fileName = name !== null ? `${companyName}_${companyUuidFile}/${constant_1.default.folder.LIBRARY}/${constant_1.default.folder_prefix.USER}_${userUuidFile}/${folderName[0]}` : null;
                    return fileName;
                }
                else {
                    //
                    //  get user details by uuid
                    //
                    const userDetails = yield user_repo_1.default.getUserByUuid(userUuuid);
                    const userUuidFile = userDetails.uuid.replace(/-/g, '_');
                    let folderName;
                    if (name !== null) {
                        folderName = name.split(".");
                    }
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = name !== null ? `${constant_1.default.folder_prefix.USER}_${userUuidFile}/${constant_1.default.folder.LIBRARY}/${folderName[0]}` : null;
                    return fileName;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get production folder path
    🗓 @created : 28/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getProductionFolderPath(companyUuid, userUuuid, name, productionDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (companyUuid) {
                    //
                    //  get company details by uuid
                    //
                    const companyDetails = yield company_repos_1.default.checkCompanyExists(companyUuid);
                    const companyUuidFile = companyDetails.uuid.replace(/-/g, '_');
                    // if(companyDetails.name.includes(" ")){
                    // var companyName = companyDetails.name.replace(/\s/g, '');
                    // }else{
                    // var companyName = companyDetails.name
                    // }
                    var companyName = constant_1.default.folder_prefix.COMPANY;
                    const productionUuidFile = productionDetails.uuid.replace(/-/g, '_');
                    // if(productionDetails.name.includes(" ")){
                    // var productionName = productionDetails.name.replace(/\s/g, '');
                    // }else{
                    // var productionName = productionDetails.name
                    // }
                    var productionName = constant_1.default.folder_prefix.PRODUCTION;
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${companyName}_${companyUuidFile}/${constant_1.default.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${constant_1.default.folder.EXPORT}/${name}`;
                }
                else {
                    //
                    //  get user details by uuid
                    //
                    const userDetails = yield user_repo_1.default.getUserByUuid(userUuuid);
                    const userUuidFile = userDetails.uuid.replace(/-/g, '_');
                    const productionUuidFile = productionDetails.uuid.replace(/-/g, '_');
                    // if(productionDetails.name.includes(" ")){
                    // var productionName = productionDetails.name.replace(/\s/g, '');
                    // }else{
                    // var productionName = productionDetails.name
                    // }
                    var productionName = constant_1.default.folder_prefix.PRODUCTION;
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${constant_1.default.folder_prefix.USER}_${userUuidFile}/${constant_1.default.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${constant_1.default.folder.EXPORT}/${name}`;
                }
                return fileName;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       👑 @creator : Sushant Shekhar
       🚩 @uses : get hls folder path
       🗓 @created : 06/12/2024
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       */
    getHlsFolderPath(companyUuid, userUuuid, exportUuid, productionDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (companyUuid) {
                    //
                    //  get company details by uuid
                    //
                    const companyDetails = yield company_repos_1.default.checkCompanyExists(companyUuid);
                    const companyUuidFile = companyDetails.uuid.replace(/-/g, '_');
                    var companyName = constant_1.default.folder_prefix.COMPANY;
                    const productionUuidFile = productionDetails.uuid.replace(/-/g, '_');
                    var productionName = constant_1.default.folder_prefix.PRODUCTION;
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${companyName}_${companyUuidFile}/${constant_1.default.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${constant_1.default.folder.EXPORT}/${constant_1.default.folder.OUTPUT_HLS}_${exportUuid}`;
                }
                else {
                    //
                    //  get user details by uuid
                    //
                    const userDetails = yield user_repo_1.default.getUserByUuid(userUuuid);
                    const userUuidFile = userDetails.uuid.replace(/-/g, '_');
                    const productionUuidFile = productionDetails.uuid.replace(/-/g, '_');
                    var productionName = constant_1.default.folder_prefix.PRODUCTION;
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${constant_1.default.folder_prefix.USER}_${userUuidFile}/${constant_1.default.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${constant_1.default.folder.EXPORT}/${constant_1.default.folder.OUTPUT_HLS}_${exportUuid}`;
                }
                return fileName;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new S3Folder();
//# sourceMappingURL=s3Folder.helper.js.map