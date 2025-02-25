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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const tutorial_repo_1 = __importDefault(require("../repos/tutorial.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get tutorial details by uuid service
🗓 @created : 01/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTutorialDetailsByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check tutorial exists or not and send the response
        //
        container.derived.tutorialData = yield tutorial_repo_1.default.getTutorialByUuid(params.uuid);
        //
        //  get tag name
        //
        yield getTagName(container);
        //
        //  get relate articles details
        //
        yield getRelatedArticles(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get the tag details
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTagName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { tutorialData } } = container;
        container.derived.tagData = [];
        if (tutorialData.tag_uuid) {
            for (let i = 0; i < tutorialData.tag_uuid.length; i++) {
                //
                // get tag object
                //
                const tagDetail = yield tutorial_repo_1.default.getTagNameByUuid(tutorialData.tag_uuid[i]);
                container.derived.tagData.push(tagDetail);
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
🚩 @uses : get the related articles details
🗓 @created : 14/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getRelatedArticles = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { tutorialData, tagData } } = container;
        container.derived.relatedData = [];
        if (tutorialData.related_article) {
            for (let i = 0; i < tutorialData.related_article.length; i++) {
                //
                //  get the related object
                //
                const articleDetails = yield tutorial_repo_1.default.getRelatedArticle(tutorialData.related_article[i]);
                container.derived.relatedData.push(articleDetails);
            }
        }
        delete tutorialData.tag_uuid;
        delete tutorialData.related_article;
        //
        // store production data in container result
        //
        container.output.result = tutorialData;
        container.output.result.tag = tagData;
        container.output.result.related_articles = container.derived.relatedData;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getTutorialDetailsByUuid;
//# sourceMappingURL=getTutorialDetailsByUuid.service.js.map