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
// Import Transformers
// Import Libraries
// Import Services
// Import Helpers
// Import Repos
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update library usage details service
🗓 @created : 04/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLibraryUsageService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { files, libraryFolderSize, fileDetails, file } } = container;
        //
        //  preapre data model to update library s3 usage
        //
        const s3UsageDataModel = {
            s3_usage: libraryFolderSize,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        if (fileDetails && fileDetails.uuid) {
            //
            //  update library
            //
            yield library_repo_1.default.updateLibraryDetailsByFileUuid(fileDetails.uuid, s3UsageDataModel);
        }
        if (file && file.uuid) {
            //
            //  update library
            //
            yield library_repo_1.default.updateLibraryDetailsByFileUuid(file.uuid, s3UsageDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateLibraryUsageService;
//# sourceMappingURL=updateLibraryS3Usage.serive.js.map