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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// import { FileInterface } from "../../../interface/FileInterface";
// Import validations
const fileValidator_helper_1 = __importDefault(require("../../../helpers/fileValidator.helper"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// import userRepo from "../../user/repo/user.repo";
// Import Transformers
// Import Libraries
// Import Repos
const file_repo_1 = __importDefault(require("../repo/file.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : to save the files to master
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFile = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, derived: { files } } = container;
        //
        // validate the derived
        //
        yield fileValidator_helper_1.default.fileDataValidator(container.derived);
        //
        // save the user files
        //
        yield saveUserFiles(container);
        //
        //  If type is profile_pic then directly store in file uuid
        //
        if (container.input.query.type === 'USER_PROFILE_PIC') {
            yield saveProfilePic(container);
        }
        //
        //  If type is export_embed_pic 
        //
        if (container.input.query.type === 'EXPORT_EMBED_PIC') {
            yield saveExportEmbedVideoImage(container);
        }
        //
        // Get the user by uuid
        //
        container.output.message = i18n_1.default.__('file_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : to save the user file data
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserFiles = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, query }, derived: { files } } = container;
        //
        // Prepare the model
        //
        const fileData = [];
        const output = [];
        let tutorial_url = null;
        let embed_thumbnail = null;
        for (const file of files) {
            let fileModelData = {
                name: file.name,
                ref_uuid: null,
                ref_type: null,
                content_type: file.type,
                type: file.type.split('/')[0],
                aws_s3_url: file.url,
                thumbnail_file_name: '1696341550825_img2.png',
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
            };
            fileData.push(fileModelData);
        }
        const fileUuids = yield file_repo_1.default.saveFileData(fileData);
        if (body.type == "TUTORIAL_DESC") {
            const getFileDetails = yield file_repo_1.default.getFileByUuid(fileUuids[0].uuid);
            tutorial_url = `${constant_1.default.app.CLOUDFRONT_URL}/${getFileDetails.name}`;
        }
        if (query.type == 'EXPORT_EMBED_PIC') {
            const getFileDetails = yield file_repo_1.default.getFileByUuid(fileUuids[0].uuid);
            embed_thumbnail = getFileDetails.aws_s3_url.split('/').slice(3).join('/');
        }
        for (const [i, file] of files.entries()) {
            let fileObject = Object.assign(Object.assign({}, file), { uuid: fileUuids[i].uuid });
            if (tutorial_url) {
                fileObject.tutorial_url = tutorial_url;
            }
            if (embed_thumbnail) {
                fileObject.embed_thumbnail = `${constant_1.default.app.CLOUDFRONT_URL}/${embed_thumbnail}`;
            }
            output.push(fileObject);
        }
        container.output.result = output;
        //
        //  save ref type to bio pic and ref uuid as user uuid
        //
        if (body.type == "LIBRARY") {
            //
            //  get logged in user company uuid
            //
            const company = yield user_repo_1.default.getCompanyByUserUuid(logged_in_user.uuid);
            const libraryData = [];
            for (const data of fileUuids) {
                //
                //  prepare data model to save user library data
                //
                const saveLibraryDataModel = {
                    company_uuid: company.company_uuid,
                    user_uuid: logged_in_user.uuid,
                    file_uuid: data.uuid,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
                libraryData.push(saveLibraryDataModel);
            }
            //
            //  save library
            //
            const library = yield user_repo_1.default.saveLibrary(libraryData);
            for (const libData of library) {
                //
                //  prepare data model to upadte file data
                //
                const updateFileData = {
                    ref_type: "user_library",
                    ref_uuid: libData.uuid
                };
                yield file_repo_1.default.updateFiledata(libData.file_uuid, updateFileData);
            }
        }
        if (body.type == "TUTORIAL_DESC") {
            //
            //  update the file table with ref uuid and ref type
            //
            const updateFileData = {
                ref_uuid: logged_in_user.uuid,
                ref_type: "TUTORIAL_DESC"
            };
            const fileUuidArray = fileUuids.map((item) => {
                return item.uuid;
            });
            yield file_repo_1.default.updateFiledata(fileUuidArray[0], updateFileData);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : to save the files to master
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveProfilePic = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { files } } = container;
        //
        //  file model
        //
        const profilePicModel = {
            ref_uuid: logged_in_user.uuid,
            ref_type: 'profile_pic',
            name: container.derived.files[0].name,
            content_type: container.derived.files[0].type,
            aws_s3_url: container.derived.files[0].url,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        const fileData = yield file_repo_1.default.saveFileData(profilePicModel);
        const userDetail = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
        const userProfilPicModel = {
            file_uuid: fileData[0].uuid
        };
        yield user_repo_1.default.updateProfilePicFileUuid(userDetail.uuid, userProfilPicModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : to save the files to master
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveExportEmbedVideoImage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user }, derived: { files } } = container;
        //
        //  file model
        //
        const EmbedVideoCoverImageModel = {
            ref_uuid: logged_in_user.uuid,
            ref_type: 'embed_cover_image',
            name: container.derived.files[0].name,
            content_type: container.derived.files[0].type,
            aws_s3_url: container.derived.files[0].url,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        const fileData = yield file_repo_1.default.saveFileData(EmbedVideoCoverImageModel);
        const embedVideoModel = {
            embed_thumbnail: fileData[0].uuid
        };
        yield export_repo_1.default.updateExportDetails(query.export_uuid, embedVideoModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveFile;
//# sourceMappingURL=saveFile.service.js.map