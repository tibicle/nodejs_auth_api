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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Transformers
// Import Libraries
const aws_1 = __importDefault(require("../../../library/aws"));
const library_repo_1 = __importDefault(require("../repo/library.repo"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete library file
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteLibraryFile = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { files } } = container;
        const libraryData = container.input.query.library_uuid;
        if (Array.isArray(libraryData)) {
            for (let i = 0; i < libraryData.length; i++) {
                //
                //  check library file exists or not 
                //
                container.derived.libraryDetails = yield library_repo_1.default.checkFileByUuid(container.input.query.library_uuid[i]);
                //
                //  delete file from required tables.
                //
                yield deleteLibrary(container);
                //
                //  delete file from s3 bucket and file table
                //
                yield deleteFileFromS3(container);
            }
        }
        else {
            //
            //  check library file exists or not 
            //
            container.derived.libraryDetails = yield library_repo_1.default.checkFileByUuid(container.input.query.library_uuid);
            //
            //  delete file from required tables.
            //
            yield deleteLibrary(container);
            //
            //  delete file from s3 bucket and file table
            //
            yield deleteFileFromS3(container);
        }
        //
        //  delete success message
        //
        container.output.message = i18n_1.default.__('file_delete_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete library
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteLibrary = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { libraryDetails } } = container;
        //
        //  get production media details
        //
        const productionMediaDetails = yield production_repo_1.default.getProductionMediaByLibraryUuid(libraryDetails.uuid);
        if (productionMediaDetails && productionMediaDetails.length > 0) {
            for (const uuid of productionMediaDetails) {
                //
                //  get library details by uuid
                //
                const libraryDetails = yield library_repo_1.default.getLibraryByUuid(uuid.library_uuid);
                //
                //  delete timeline data is exists
                //
                yield production_repo_1.default.deleteProductionTimelineFromLibrary(libraryDetails.file_uuid);
            }
        }
        //
        //  delete library from production media if exists
        //
        yield production_repo_1.default.deleteProductionMedia(libraryDetails.uuid);
        //
        //  delete library file from library table
        //
        yield library_repo_1.default.deleteLibraryFile(libraryDetails.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete file from s3 bucket and file table
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteFileFromS3 = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { libraryDetails } } = container;
        //
        //  get file details
        //
        const fileDetails = yield file_repo_1.default.getFileByUuid(libraryDetails.file_uuid);
        if (fileDetails) {
            if (libraryDetails.company_uuid) {
                var folder = yield s3Folder_helper_1.default.getFolderPath(libraryDetails.company_uuid, libraryDetails.user_uuid, fileDetails.name);
            }
            else {
                var folder = yield s3Folder_helper_1.default.getFolderPath(libraryDetails.company_uuid, libraryDetails.user_uuid, fileDetails.name);
            }
            //
            //  delete file from s3 Bucket 
            //
            yield aws_1.default.deleteFolder(`${constant_1.default.app.AWS_BUCKET_NAME}`, `${folder}/`);
            //
            //  delete file from file table
            //
            yield file_repo_1.default.deleteFileByuuid(fileDetails.uuid);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteLibraryFile;
//# sourceMappingURL=deleteLibrary.service.js.map