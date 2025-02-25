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
// Import validations
// Import Transformers
// Import Libraries
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const user_repo_1 = __importDefault(require("../repos/user.repo"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : edit user profile
* 🗓 Created : 15/11/2023
*/
const updateUserProfileService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  validate mobile number
        //
        yield validateMobileNumber(container);
        //
        //  update user profile
        //
        yield updateUserProfile(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : validate mobile number already exist or not
* 🗓 Created : 15/11/2023
*/
const validateMobileNumber = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        if (body.mobile_no) {
            //
            //  check mobile number already exist or not
            //
            const mobileData = yield user_repo_1.default.checkUserMobile(body.mobile_no);
            if (mobileData && mobileData.uuid != logged_in_user.uuid) {
                const err = new Error(i18n_1.default.__('user.mobile_number_already_exists'));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : update user profile
* 🗓 Created : 15/11/2023
*/
const updateUserProfile = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  user model
        //
        const userModel = {
            first_name: body.firstname,
            last_name: body.lastname,
            mobile_no: body.mobile_no,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  update user profile
        //
        yield user_repo_1.default.updateUserProfile(logged_in_user.uuid, userModel);
        if (body.user_profile_bio || body.interest || body.help || body.experience_level || body.pre_production || body.production || body.post_production) {
            //
            // get company profile data
            //
            const userProfile = yield user_repo_1.default.getUserProfileByUserUuid(logged_in_user.uuid);
            if (!userProfile) {
                //
                //  company profile model
                //
                const userProfileModel = {
                    user_uuid: logged_in_user.uuid,
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
            }
            else {
                //
                //  user profile model
                //
                const userProfileModel = {
                    user_uuid: logged_in_user.uuid,
                    user_profile_bio: body.user_profile_bio,
                    interest: body.interest,
                    help: body.help,
                    experience_level: body.experience_level,
                    pre_production: body.pre_production,
                    production: body.production,
                    post_production: body.post_production,
                    updated_by: logged_in_user.uuid,
                    updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
                };
                yield user_repo_1.default.updateNewUserProfile(userProfile.uuid, userProfileModel);
            }
        }
        container.output.message = i18n_1.default.__('user.user_profile_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateUserProfileService;
//# sourceMappingURL=updateUserProfile.service.js.map