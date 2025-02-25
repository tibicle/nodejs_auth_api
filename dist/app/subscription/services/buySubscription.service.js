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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Libraries
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../repo/subscription.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get subscription by uuid
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const buySubscriptionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  check subscription exists or not
        //
        container.derived.subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(body.subscription_uuid);
        if (!container.derived.subscriptionDetails) {
            const err = new Error(i18n_1.default.__('subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        if (body.company_uuid && container.derived.subscriptionDetails == constant_1.default.subscription_plan.SOLO) {
            const err = new Error(i18n_1.default.__('subscription.solo_not_buy'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  check user exists or not if user_uuid is there
        //
        if (body.user_uuid && body.user_uuid != null) {
            yield user_repo_1.default.getUserByUuid(body.user_uuid);
            //
            //  check user have any pending subscription or not
            //
            const userApprovedSubscription = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(body.user_uuid);
            if (userApprovedSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_approved_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
            const currentActivePlan = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(body.user_uuid);
            if (currentActivePlan) {
                const subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(currentActivePlan.subscription_uuid);
                const bodySubscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(body.subscription_uuid);
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.TEAM.toLowerCase() && (subscriptionDetails.name).toLowerCase() === (bodySubscriptionDetails.name).toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.same_team_plan'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                //
                //  check user cannot buy solo in upgrade plan
                //
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.TEAM.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.SOLO.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.solo_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.ENTERPRISE.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.SOLO.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.solo_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.ENTERPRISE.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.TEAM.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.team_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
            }
            //
            //  check user have any pending subscrition or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(body.user_uuid);
            if (userSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
        }
        //
        //  check company exists or not if compnay_uuid is there
        //
        if (body.company_uuid && body.company_uuid != null) {
            yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            //
            //  check company have any approved subscription or not
            //
            const companyApprovedSubscription = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(body.company_uuid);
            if (companyApprovedSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_approved_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
            const currentActivePlan = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            if (currentActivePlan) {
                const subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(currentActivePlan.subscription_uuid);
                const bodySubscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(body.subscription_uuid);
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.TEAM.toLowerCase() && (subscriptionDetails.name).toLowerCase() === (bodySubscriptionDetails.name).toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.same_team_plan'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                //
                //  check user cannot buy solo in upgrade plan
                //
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.TEAM.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.SOLO.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.solo_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.ENTERPRISE.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.SOLO.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.solo_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                if (subscriptionDetails && (subscriptionDetails.name).toLowerCase() === constant_1.default.subscription_plan.ENTERPRISE.toLowerCase() && (bodySubscriptionDetails.name).toLowerCase() == constant_1.default.subscription_plan.TEAM.toLowerCase()) {
                    const err = new Error(i18n_1.default.__('subscription.team_not_buy'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
            }
            //
            //  check company have any pending subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(body.company_uuid);
            if (companySubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
        }
        //
        //  validate user has already buy any subscription currently active
        //
        yield validateActiveUserSubscription(container);
        //
        //  save user subscription details
        //
        yield saveUserSubscription(container);
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('subscription.purchase_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save user subscription details
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails } } = container;
        const planStorage = subscriptionDetails && subscriptionDetails.storage.split(' ');
        //
        //  prepare data model to save user subscription
        //
        const saveUserSubscriptionDataModel = {
            subscription_uuid: body.subscription_uuid,
            user_uuid: body.user_uuid,
            company_uuid: body.company_uuid,
            status: constant_1.default.subscription_status.PENDING,
            storage: planStorage[0],
            total_minutes: subscriptionDetails.total_minutes,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  save user subscription
        //
        const userSubscription = yield subscription_repo_1.default.saveUserSubscription(saveUserSubscriptionDataModel);
        // //
        // //  generate six digit random hash code to store transaction id
        // //
        // const transactionId = await authHelper.generateSixDigitRandomHashCode();
        // //
        // //  prepare data model to save user tansaction
        // //
        // const saveUserTransactionDataModel:any = {
        //     user_subscription_uuid: userSubscription.uuid,
        //     file_uuid: null,
        //     price_amount: subscriptionDetails.price,
        //     transaction_id: transactionId,
        //     created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss")
        // }
        // //
        // //  save user transaction
        // //
        // const userTransaction = await transactionRepo.saveTransaction(saveUserTransactionDataModel);
        container.output.result.plan_details = subscriptionDetails;
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate user has currently any active subscription
🗓 @created : 28/08/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateActiveUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails } } = container;
        //
        //  check user exists or not if user_uuid is there
        //
        if (body.user_uuid && body.user_uuid != null) {
            yield user_repo_1.default.getUserByUuid(body.user_uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(body.user_uuid);
            if (userSubscription && (userSubscription.status !== 'DEACTIVE' || userSubscription.status !== 'EXPIRED') && userSubscription.subscription_uuid == body.subscription_uuid) {
                const err = new Error(i18n_1.default.__('subscription.already_in_active_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
        }
        //
        //  check company exists or not if compnay_uuid is there
        //
        if (body.company_uuid && body.company_uuid != null) {
            yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            if (companySubscription && (companySubscription.status !== 'DEACTIVE' || companySubscription.status !== 'EXPIRED') && companySubscription.subscription_uuid == body.subscription_uuid) {
                const err = new Error(i18n_1.default.__('subscription.already_in_active_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = buySubscriptionService;
//# sourceMappingURL=buySubscription.service.js.map