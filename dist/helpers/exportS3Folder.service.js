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
// Import Thirdparty
class S3FolderExport {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get the library folder path
    🗓 @created : 28/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getFolderPath(body, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.company_uuid) {
                    //
                    //  get company details by uuid
                    //
                    // const companyDetails = await companyRepos.checkCompanyExists(companyUuid);
                    //
                    //  get user details by uuid
                    //
                    // const userDetails = await userRepo.getUserByUuid(userUuuid);
                    const companyUuidFile = body.company_uuid.replace(/-/g, '_');
                    const userUuidFile = body.user_uuid.replace(/-/g, '_');
                    // if(body.company_name.includes(" ")){
                    // var companyName = body.company_name.replace(/\s/g, '');
                    // }else{
                    // var companyName = body.company_name
                    // }   
                    var companyName = constant_1.default.folder_prefix.COMPANY;
                    const folderName = name.split(".");
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${companyName}_${companyUuidFile}/${constant_1.default.folder.LIBRARY}/${constant_1.default.folder_prefix.USER}_${userUuidFile}/${folderName[0]}`;
                }
                else {
                    //
                    //  get user details by uuid
                    //
                    // const userDetails = await userRepo.getUserByUuid(userUuuid);
                    const userUuidFile = body.user_uuid.replace(/-/g, '_');
                    const folderName = name.split(".");
                    //
                    //  create folder structure and return the file name
                    //
                    var fileName = `${constant_1.default.folder_prefix.USER}_${userUuidFile}/${constant_1.default.folder.LIBRARY}/${folderName[0]}`;
                }
                return fileName;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new S3FolderExport();
//# sourceMappingURL=exportS3Folder.service.js.map