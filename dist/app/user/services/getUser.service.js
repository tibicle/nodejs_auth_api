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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import validations
// Import Transformers
// Import Libraries
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const user_repo_1 = __importDefault(require("../repos/user.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : to get the user
* 🗓 Created : 19/10/2023
*/
const getUser = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, logged_in_user }, } = container;
        //
        // get all the details of user
        //
        container.output.result = yield user_repo_1.default.getUserFullProfile(logged_in_user.uuid);
        //
        //  get subscription object
        //
        yield getUserSubscription(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get subscription on basis of user and company uuid
🗓 @created : 05/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, query }, output: { result } } = container;
        const currentDate = (0, moment_timezone_1.default)().utc().format('YYYY-MM-DD');
        var userApprovedSubscription;
        if (query.user_uuid) {
            // 
            // get user subscription
            // 
            var userSubscription = yield subscription_repo_1.default.getUserActiveSubscription(query.user_uuid);
            //
            //  get user approved subscription
            //
            userApprovedSubscription = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(query.user_uuid);
            result.company_user_role = null;
        }
        if (query.company_uuid) {
            //
            //   get company subscription
            // 
            var userSubscription = yield subscription_repo_1.default.getCompnayActiveSubscription(query.company_uuid);
            //
            //  get user approved subscription
            //
            userApprovedSubscription = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(query.company_uuid);
            //
            //  get user role in a company
            //
            var roleDetails = yield company_repos_1.default.getUserRoleByCompanyUuid(query.company_uuid);
            result.company_user_role = roleDetails.name;
        }
        if (userSubscription) {
            const startDate = moment_timezone_1.default.utc(userSubscription.start_date).format('YYYY-MM-DD');
            const endDate = moment_timezone_1.default.utc(userSubscription.end_date).format('YYYY-MM-DD');
            if (currentDate > endDate || currentDate < startDate) {
                const updateSubscriptionStatus = {
                    status: constant_1.default.subscription_status.EXPIRED
                    // subscription_status: config.user_subscription_status.CANCEL_SYSTEM
                };
                if (userSubscription.subscription_status == null) {
                    updateSubscriptionStatus.subscription_status = constant_1.default.subscription_status.CANCEL_SYSTEM;
                }
                //
                //  update user subscription status
                //
                yield subscription_repo_1.default.updateUserSubscriptionStatus(userSubscription.uuid, updateSubscriptionStatus);
                // change status in userSubscription
                userSubscription.status = 'EXPIRED';
            }
        }
        //
        //  check is there any status which is in APPROVED state
        //
        if (userApprovedSubscription && userApprovedSubscription.status == constant_1.default.subscription_status.APPROVED) {
            const approvedStartDate = moment_timezone_1.default.utc(userApprovedSubscription.start_date).format('YYYY-MM-DD');
            //
            // Compare the full datetime to ensure both date and time match
            //
            if (currentDate >= approvedStartDate) {
                //
                // prepare data model to make user subscription active
                //
                const changeStatusDataModel = {
                    status: constant_1.default.subscription_status.ACTIVE,
                    updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                    updated_by: logged_in_user.uuid
                };
                //
                //  update user subscription data
                //
                yield subscription_repo_1.default.updateUserSubscription(userApprovedSubscription.uuid, changeStatusDataModel);
            }
        }
        if (query.user_uuid) {
            // 
            // get user subscription
            // 
            var userSubscription = yield subscription_repo_1.default.getUserActiveSubscription(query.user_uuid);
        }
        if (query.company_uuid) {
            //
            //   get company subscription
            // 
            var userSubscription = yield subscription_repo_1.default.getCompnayActiveSubscription(query.company_uuid);
        }
        //
        //  store user subscription response
        //
        if (userSubscription && userSubscription.status == 'ACTIVE') {
            result.subscription = {
                id: userSubscription.uuid,
                name: userSubscription.name,
                status: userSubscription.status,
                start_date: userSubscription.start_date,
                end_date: userSubscription.end_date,
                renewal_date: userSubscription.renewal_date,
                // product_id: userSubscription.google_product_id ? userSubscription.google_product_id : userSubscription.apple_product_id
            };
        }
        else {
            result.subscription = null;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getUser;
//# sourceMappingURL=getUser.service.js.map