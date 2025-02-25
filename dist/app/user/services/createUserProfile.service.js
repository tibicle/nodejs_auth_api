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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const user_repo_1 = __importDefault(require("../repos/user.repo"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : create user profile
* 🗓 Created : 05/09/2024
*/
const createUserProfileService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body }, } = container;
        //
        //  validate user uuid is valid
        //
        yield user_repo_1.default.getUserByUuid(body.user_uuid);
        //
        //  store user profile data 
        //
        yield storeProfileDetails(container);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('user.profile_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : store user profile in database
* 🗓 Created : 05/09/2024
*/
const storeProfileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        //
        //  validate each company has only one profile data 
        //
        let userProfileData = yield user_repo_1.default.getUserProfile(body.user_uuid);
        if (userProfileData) {
            const err = new Error(i18n_1.default.__('user.profile_already_exist'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  user profile model
        //
        const userProfileModel = {
            user_uuid: body.user_uuid,
            user_profile_bio: body.user_profile_bio,
            interest: body.interest,
            help: body.help,
            experience_level: body.experience_level,
            pre_production: body.pre_production,
            production: body.production,
            post_production: body.post_production,
            created_by: logged_in_user.uuid,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        yield user_repo_1.default.insertUserProfile(userProfileModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createUserProfileService;
//# sourceMappingURL=createUserProfile.service.js.map