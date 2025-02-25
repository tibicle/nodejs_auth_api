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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const aws_1 = __importDefault(require("../../../library/aws"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import repo
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : delete company profile image
🗓 @created : 16/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteCompanyLogo = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  get file details by uuid
        //
        const fileDetails = yield file_repo_1.default.checkFile(query.file_uuid);
        //
        //  get the folder
        //
        var folder = `company_profile_image/${fileDetails.name}`;
        //
        //  delete file from S3
        //
        yield aws_1.default.deleteFile(`${constant_1.default.app.AWS_BUCKET_NAME}`, folder);
        //
        //  delete file from file table
        //
        yield file_repo_1.default.deleteFileByuuid(fileDetails.uuid);
        //
        //  success message
        //
        container.output.message = i18n_1.default.__("company.company_logo_deleted_success");
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteCompanyLogo;
//# sourceMappingURL=deleteCompanyLogo.service.js.map