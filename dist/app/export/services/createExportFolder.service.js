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
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Repos
// Import Thirdparty
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create export folder into s3 bucket
🗓 @created : 26/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createExportFolder = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check production is bind with company or not
        //
        const productionDetails = yield production_repo_1.default.checkProductionByUuid(body.production_uuid);
        if (productionDetails.company_uuid) {
            //
            //  check company exists and get the details
            //
            var companyInfo = yield company_repos_1.default.checkCompanyExists(productionDetails.company_uuid);
        }
        if (productionDetails.company_uuid) {
            //
            //  get production details
            //
            const productionData = yield production_repo_1.default.getProductionByUuid(body.production_uuid);
            //
            //  check company exists or not
            //
            const companyDetails = yield company_repos_1.default.checkCompanyExists(companyInfo.uuid);
            const bucketName = constant_1.default.app.AWS_BUCKET_NAME;
            const companyUuid = companyDetails.uuid.replace(/-/g, '_');
            // if(companyDetails.name.includes(" ")){
            // var companyName = companyDetails.name.replace(/\s/g, '');
            // }else{
            // var companyName = companyDetails.name
            // }
            var companyName = constant_1.default.folder_prefix.COMPANY;
            const companyFolder = `${companyName}_${companyUuid}/`;
            //
            //  create folder with organization name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, companyFolder);
            //
            //  create production folder inside company folder if not exists
            //
            const production = constant_1.default.folder.PRODUCTION;
            //
            //  check production folder exists or not
            //
            const checkProductionFolder = `${companyFolder}${production}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, checkProductionFolder);
            const productionUuid = productionData.uuid.replace(/-/g, '_');
            // if(productionData.name.includes(" ")){
            // var productionName = productionData.name.replace(/\s/g, '');
            // }else{
            // var productionName = productionData.name
            // }
            var productionName = constant_1.default.folder_prefix.PRODUCTION;
            const productionFolder = `${productionName}_${productionUuid}/`;
            const createFolder = `${checkProductionFolder}${productionFolder}`;
            yield aws_1.default.checkAndCreateFolder(bucketName, createFolder);
            //
            //  create export folder
            //
            const exportData = constant_1.default.folder.EXPORT;
            const exportFolder = `${createFolder}${exportData}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, exportFolder);
        }
        else {
            //
            //  get production details
            //
            const productionData = yield production_repo_1.default.getProductionByUuid(body.production_uuid);
            //
            // get user details 
            //
            const userDetails = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
            const bucketName = constant_1.default.app.AWS_BUCKET_NAME;
            const userUuid = userDetails.uuid.replace(/-/g, '_');
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            //
            //  create folder with self name 
            //
            yield aws_1.default.checkAndCreateFolder(bucketName, selfFolder);
            //
            //  create production folder inside company folder if not exists
            //
            const production = constant_1.default.folder.PRODUCTION;
            //
            //  check production folder exists or not
            //
            const checkProductionFolder = `${selfFolder}${production}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, checkProductionFolder);
            const productionUuid = productionData.uuid.replace(/-/g, '_');
            // if(productionData.name.includes(" ")){
            // var productionName = productionData.name.replace(/\s/g, '');
            // }else{
            // var productionName = productionData.name
            // }
            var productionName = constant_1.default.folder_prefix.PRODUCTION;
            const productionFolder = `${productionName}_${productionUuid}/`;
            const createFolder = `${checkProductionFolder}${productionFolder}`;
            yield aws_1.default.checkAndCreateFolder(bucketName, createFolder);
            //
            //  create export folder
            //
            const exportData = constant_1.default.folder.EXPORT;
            const exportFolder = `${createFolder}${exportData}/`;
            yield aws_1.default.checkAndCreateFolder(bucketName, exportFolder);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createExportFolder;
//# sourceMappingURL=createExportFolder.service.js.map