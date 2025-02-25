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
// Import Static
// Import Middleware
// Import Helpers
// Import validations
// Import Interface 
// Import Libraries
// Import Repos
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save user language
🗓 @created : 13/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserLanguageService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params }, derived: {} } = container;
        //
        //  check user exists
        //
        container.derived.user = yield user_repo_1.default.getUserByUuid(params.uuid);
        //
        //  update the user language
        //
        yield updateLanguage(container);
        container.output.message = i18n_1.default.__('user.language_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update Language
🗓 @created : 13/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLanguage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        //
        //  Prepare the model to update language
        //
        const updateLanguageDataModel = {
            language: body.language,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  update the user language
        //
        container.derived.user = yield user_repo_1.default.updateStatus(params.uuid, updateLanguageDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveUserLanguageService;
//# sourceMappingURL=saveUserLanguage.service.js.map