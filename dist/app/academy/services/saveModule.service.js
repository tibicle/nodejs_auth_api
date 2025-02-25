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
const constant_1 = __importDefault(require("../../../config/constant"));
const academy_repo_1 = __importDefault(require("../repo/academy.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save module service
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveModuleService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  check the title
        //
        const module = yield academy_repo_1.default.checkModuleTitle(body.title);
        if (module) {
            const err = new Error(i18n_1.default.__('module.title_exists'));
            err.statusCode = 400;
            throw err;
        }
        container.derived.tag_uuid = [];
        //
        //  check tag is present or not
        //
        yield checkTag(container);
        //
        //  check thumbnail image exists or not
        //
        if (body.thumbnail_uuid && body.thumbnail_uuid != null) {
            yield file_repo_1.default.checkFile(body.thumbnail_uuid);
        }
        //
        //  check cover image exists or not
        //
        if (body.cover_uuid && body.cover_uuid != null) {
            yield file_repo_1.default.checkFile(body.cover_uuid);
        }
        if (body.related_article && body.related_article != null) {
            yield checkAndSaveRelatedArticles(container);
        }
        //
        //  save module data
        //
        yield saveModuleData(container);
        //
        //  update file data of module
        //
        yield updateFileDetails(container);
        container.output.message = i18n_1.default.__('module.save_module_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : check tag is present or not
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        if (body.tag || body.tag != null) {
            for (let i = 0; i < body.tag.length; i++) {
                //
                //  check tag is present or not
                //
                container.derived.tag = yield academy_repo_1.default.validateTag(body.tag[i]);
                if (container.derived.tag) {
                    container.derived.tag_uuid.push(container.derived.tag.uuid);
                }
                if (!container.derived.tag || container.derived.tag == undefined) {
                    //
                    //  if tag not found insert new tag
                    //
                    container.derived.tagname = body.tag[i];
                    yield storeTag(container);
                }
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
🚩 @uses : store new tags
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create category model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new category in category database
        //
        yield academy_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in tag_uuid array
        //
        const getTagUuid = yield academy_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.tag_uuid.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : check and save related articles
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkAndSaveRelatedArticles = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid } } = container;
        container.derived.related_article_uuid = [];
        for (const uuid of body.related_article) {
            //
            //  check tutorial exists or not 
            //
            const tutorial = yield academy_repo_1.default.checkTutorialByUuid(uuid);
            container.derived.related_article_uuid.push(tutorial.uuid);
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
🚩 @uses : save module data
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveModuleData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid, related_article_uuid } } = container;
        //
        //  prepare data model to save module data
        //
        const saveModuleDataModel = {
            title: body.title,
            description: body.description,
            tag_uuid: tag_uuid,
            access_type: body.access_type,
            related_article: related_article_uuid,
            thumbnail_uuid: body.thumbnail_uuid,
            cover_uuid: body.cover_uuid,
            author: body.author,
            created_by: logged_in_user.uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        if (body.is_publish && body.is_publish == true) {
            saveModuleDataModel.status = constant_1.default.tutorial_status.PUBLISHED;
        }
        //
        //  save module data
        //
        container.derived.moduleUuid = yield academy_repo_1.default.saveModuleData(saveModuleDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update file details
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid, moduleUuid } } = container;
        if (body.thumbnail_uuid) {
            //
            //  prepare data model to upload file data
            //
            const updateFileDataModel = {
                ref_type: constant_1.default.tutorial_image.THUMBNAIL,
                ref_uuid: moduleUuid.uuid,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield file_repo_1.default.updateFiledata(body.thumbnail_uuid, updateFileDataModel);
        }
        if (body.cover_uuid) {
            //
            //  prepare data model to uplaod file data
            //
            const updateFileDataModel = {
                ref_type: constant_1.default.tutorial_image.COVER,
                ref_uuid: moduleUuid.uuid,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield file_repo_1.default.updateFiledata(body.cover_uuid, updateFileDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveModuleService;
//# sourceMappingURL=saveModule.service.js.map