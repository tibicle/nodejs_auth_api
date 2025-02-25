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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const staticPage_repo_1 = __importDefault(require("../repos/staticPage.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update static page service
🗓 @created : 04/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStaticPageService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  check static page exists or not
        //
        yield staticPage_repo_1.default.checkStaticPageByUuid(body.static_page_uuid);
        //
        //  check the title
        //
        const staticPage = yield staticPage_repo_1.default.checkTitle(body.title.toLowerCase());
        if (staticPage && body.static_page_uuid != staticPage.uuid) {
            const err = new Error(i18n_1.default.__('staticPage.title_exists'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  update static page data
        //
        yield updateStaticPageData(container);
        container.output.message = i18n_1.default.__('staticPage.update_static_page_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save static page data
🗓 @created : 04/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStaticPageData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  prepare data model to update static page data
        //
        const updateStaticPageDataModel = {
            title: body.title.toLowerCase(),
            description: body.description,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  update static page data
        //
        yield staticPage_repo_1.default.updateStaticPageDetails(body.static_page_uuid, updateStaticPageDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateStaticPageService;
//# sourceMappingURL=updateStaticPage.service.js.map