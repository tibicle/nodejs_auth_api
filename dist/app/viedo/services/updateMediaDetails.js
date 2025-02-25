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
const thumbnail_service_1 = __importDefault(require("../../../resources/ffmpeg/thumbnail.service"));
const videoInfo_service_1 = __importDefault(require("../../../resources/ffmpeg/videoInfo.service"));
// Import Helpers
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const awsS3_1 = __importDefault(require("../../../config/awsS3"));
const fs_1 = __importDefault(require("fs"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const getVideoDetailsJob_service_1 = __importDefault(require("./getVideoDetailsJob.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update media details service
🗓 @created : 09/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateMediaDetailsService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { files } } = container;
        //
        //  check file exists or not
        //
        container.derived.fileDetails = yield file_repo_1.default.checkFile(body.file_uuid);
        //
        //  get the file name from required folder
        //
        container.derived.fileName = yield s3Folder_helper_1.default.getFolderPath(body.company_uuid, logged_in_user.uuid, container.derived.fileDetails.name);
        //
        // Extract the audio
        //
        if (container.derived.fileDetails.type == constant_1.default.media_type.video) {
            //
            //  extract audio from video file 
            //
            // await extractAudio(container);
            //
            //  create thumbnail image from video file
            //
            // await createThumbnailImage(container);
            // await getVideoDetails(container);
        }
        else {
            // await getVideoDetails(container);
        }
        //
        //  save file details 
        //
        yield saveFileDetails(container);
        //
        //  store the result into container
        //
        if (container.derived.duplicateFileName) {
            container.output.message = i18n_1.default.__('file_already_exist_success');
        }
        else {
            container.output.message = i18n_1.default.__('file_success');
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create thumbnail image from video file
🗓 @created : 12/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createThumbnailImage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, fileName } } = container;
        console.log("=======inside create thumbnail image========");
        container.derived.image = yield thumbnail_service_1.default.createImage(`${fileName}/${fileDetails.name}`, fileDetails.uuid);
        console.log("==============command to thumbnail image process completed======");
        const thumbnailKey = 'thumbnail' + Date.now() + '.png';
        const fileContent = fs_1.default.createReadStream(`${container.derived.image}`);
        const thumbnailUploadParams = {
            Bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
            Key: `${fileName}/${thumbnailKey}`,
            Body: fileContent
        };
        console.log("======inside thumbnail image upload to S3=======");
        const uploadThumbnail = yield awsS3_1.default.upload(thumbnailUploadParams).promise();
        console.log("======thumbnail image upload to S3 completed=======");
        if (uploadThumbnail) {
            fs_1.default.unlinkSync(`${container.derived.image}`);
        }
        container.derived.image = thumbnailKey;
        return container;
    }
    catch (error) {
        console.log(JSON.stringify(error));
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save file details
🗓 @created : 10/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { fileDetails, audio, image, updatedTag } } = container;
        if (body.tag) {
            container.derived.updatedTag = [];
            yield getUpdatedTagUuid(container);
        }
        //
        // validate file name should not be duplicate
        //
        container.derived.duplicateFileName = yield library_repo_1.default.validateLibraryName(body.name);
        container.derived.libraryName = yield checkLibraryName(container);
        //
        //  prepare data model to save library details
        //
        const saveLibraryDataModel = {
            company_uuid: body.company_uuid,
            user_uuid: logged_in_user.uuid,
            file_uuid: body.file_uuid,
            name: container.derived.libraryName ? fileDetails.name : body.name,
            description: body.description,
            tag_uuid: container.derived.updatedTag,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  save library
        //
        const [library] = yield user_repo_1.default.saveLibrary(saveLibraryDataModel);
        //
        //  prepare data model to update file data
        //
        const updateFileData = {
            ref_type: "user_library",
            ref_uuid: library.uuid,
            audio_name: audio,
            // thumbnail_file_name: image
        };
        yield file_repo_1.default.updateFiledata(library.file_uuid, updateFileData);
        //
        //  extract video info
        //
        yield (0, getVideoDetailsJob_service_1.default)(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
const getVideoDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { fileDetails, fileName } } = container;
        const videoData = yield videoInfo_service_1.default.extractFileInfo(`${fileName}/${fileDetails.name}`);
        if (videoData) {
            if (fileDetails.type == 'video') {
                //
                //  prepare data model to update video details
                //
                const updateVideoDetails = {
                    length: videoData.duration == 'N/A' ? null : videoData.duration,
                    quality: videoData.videoStream.width + 'x' + videoData.videoStream.height,
                    aspect_ratio: videoData.videoStream.display_aspect_ratio == 'N/A' ? null : videoData.videoStream.display_aspect_ratio,
                    resolution_type: constant_1.default.resolution_type[videoData.videoStream.width + 'x' + videoData.videoStream.height],
                    size: videoData.size == 'N/A' ? null : videoData.size
                };
                //
                // update file details
                //
                yield file_repo_1.default.updateFiledata(body.file_uuid, updateVideoDetails);
            }
            if (fileDetails.type == 'audio') {
                //
                //  prepare data model to update video details
                //
                const updateVideoDetails = {
                    length: videoData.duration == 'N/A' ? null : videoData.duration,
                    size: videoData.size == 'N/A' ? null : videoData.size
                };
                //
                // update file details
                //
                yield file_repo_1.default.updateFiledata(body.file_uuid, updateVideoDetails);
            }
            if (fileDetails.type == 'image') {
                //
                //  prepare data model to update video details
                //
                const updateVideoDetails = {
                    // length: videoData.duration == 'N/A' ? null : videoData.duration ,
                    quality: videoData.videoStream.width + 'x' + videoData.videoStream.height,
                    aspect_ratio: videoData.videoStream.display_aspect_ratio == 'N/A' ? null : videoData.videoStream.display_aspect_ratio,
                    resolution_type: constant_1.default.resolution_type[videoData.videoStream.width + 'x' + videoData.videoStream.height],
                    size: videoData.size == 'N/A' ? null : videoData.size
                };
                //
                // update file details
                //
                yield file_repo_1.default.updateFiledata(body.file_uuid, updateVideoDetails);
            }
        }
        return container;
    }
    catch (error) {
        console.log("ERROR FROM SERVICE");
        console.log(error);
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : check the new tag
🗓 @created : 29/04/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUpdatedTagUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        //
        //  check and store the new tag
        //
        for (let i = 0; i < body.tag.length; i++) {
            //
            // validate tag is present or not
            //
            container.derived.tag = yield library_repo_1.default.validateTag(body.tag[i]);
            if (container.derived.tag) {
                //
                //  store update tag uuid in array
                //
                container.derived.updatedTag.push(container.derived.tag.uuid);
            }
            if (!container.derived.tag || container.derived.tag == undefined) {
                //
                // if tag not found insert new tag
                //
                container.derived.tagname = body.tag[i];
                yield storeTag(container);
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : store the new tags
🗓 @created : 29/04/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create tag model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            type: constant_1.default.tag_type.LIBRARY,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new category in category database
        //
        yield library_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in updated tag array
        //
        const getTagUuid = yield library_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.updatedTag.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check name is already present or not
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkLibraryName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        if (body.company_uuid) {
            //
            //  check team name exists or not in particular company
            //
            const companyProductionValidation = yield library_repo_1.default.validateLibraryNameForCompany(body.name, body.company_uuid);
            if (companyProductionValidation) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            //
            //  check team name exists or not for self
            //
            const selfProductionValidation = yield library_repo_1.default.validateLibraryNameForSelf(body.name, logged_in_user.uuid);
            if (selfProductionValidation) {
                return true;
            }
            else {
                return false;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateMediaDetailsService;
//# sourceMappingURL=updateMediaDetails.js.map