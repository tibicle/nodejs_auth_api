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
const tutorial_repo_1 = __importDefault(require("../repos/tutorial.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update tutorial service
🗓 @created : 01/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateTutorialService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  check tutorial exists or not
        //
        yield tutorial_repo_1.default.checkTutorialByUuid(body.tutorial_uuid);
        //
        //  check the title
        //
        const tutorial = yield tutorial_repo_1.default.checkTitle(body.title.toLowerCase());
        if (tutorial && body.tutorial_uuid != tutorial.uuid) {
            const err = new Error(i18n_1.default.__('tutorial.title_exists'));
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
        //  update tutorial data
        //
        yield updateTutorialData(container);
        //
        //  update file data of tutorial
        //
        yield updateFileDetails(container);
        container.output.message = i18n_1.default.__('tutorial.update_tutorial_success');
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
                container.derived.tag = yield tutorial_repo_1.default.validateTag(body.tag[i]);
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
        yield tutorial_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in tag_uuid array
        //
        const getTagUuid = yield tutorial_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
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
            const tutorial = yield tutorial_repo_1.default.checkTutorialByUuid(uuid);
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
🚩 @uses : save tutorial data
🗓 @created : 01/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateTutorialData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid, related_article_uuid } } = container;
        //
        //  prepare data model to update tutorial data
        //
        const updateTutorialDataModel = {
            title: body.title.toLowerCase(),
            description: body.description,
            type: 'TUTORIAL',
            tag_uuid: tag_uuid,
            access_type: body.access_type,
            article_type: body.article_type,
            related_article: related_article_uuid ? related_article_uuid : null,
            thumbnail_uuid: body.thumbnail_uuid,
            cover_uuid: body.cover_uuid,
            author: body.author,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  update tutorial data
        //
        yield tutorial_repo_1.default.updateTutorialDetails(body.tutorial_uuid, updateTutorialDataModel);
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
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { tag_uuid, tutorialUuid } } = container;
        if (body.thumbnail_uuid) {
            //
            //  prepare data model to uplaod file data
            //
            const updateFileDataModel = {
                ref_type: constant_1.default.tutorial_image.THUMBNAIL,
                ref_uuid: body.tutorial_uuid,
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
                ref_uuid: body.tutorial_uuid,
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
exports.default = updateTutorialService;
//# sourceMappingURL=updateTutorial.service.js.map