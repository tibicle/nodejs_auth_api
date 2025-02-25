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
const academy_repo_1 = __importDefault(require("../repo/academy.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get module details by uuid service
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserModuleDetailsByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check module exists or not and send the response
        //
        container.derived.moduleData = yield academy_repo_1.default.getModuleByUuid(params.uuid);
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
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTagName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { moduleData } } = container;
        container.derived.tagData = [];
        if (moduleData.tag_uuid) {
            for (let i = 0; i < moduleData.tag_uuid.length; i++) {
                //
                // get tag object
                //
                const tagDetail = yield academy_repo_1.default.getTagNameByUuid(moduleData.tag_uuid[i]);
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
🗓 @created : 29/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getRelatedArticles = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { moduleData, tagData } } = container;
        container.derived.relatedData = [];
        if (moduleData.related_article) {
            for (let i = 0; i < moduleData.related_article.length; i++) {
                //
                //  get the related object
                //
                const articleDetails = yield academy_repo_1.default.getRelatedArticle(moduleData.related_article[i]);
                container.derived.relatedData.push(articleDetails);
            }
        }
        delete moduleData.tag_uuid;
        delete moduleData.related_article;
        //
        // store production data in container result
        //
        container.output.result = moduleData;
        container.output.result.tag = tagData;
        container.output.result.related_articles = container.derived.relatedData;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getUserModuleDetailsByUuid;
//# sourceMappingURL=getUserModuleDetailsByUuid.service.js.map