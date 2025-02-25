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
// Import Helpers
const auth_helper_1 = __importDefault(require("../../auth/helper/auth.helper"));
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
// Import Third-party 
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
const transaction_repo_1 = __importDefault(require("../../transaction/repo/transaction.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save transaction service
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const renewSubscriptionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  check user subscription exists or not
        //
        container.derived.subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(body.subscription_uuid);
        if (!container.derived.subscriptionDetails) {
            const err = new Error(i18n_1.default.__('subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  get user active subscription details
        //
        container.derived.userSubscriptionDetails = yield subscription_repo_1.default.checkUserSubscription(body.user_subscription_uuid);
        if (!container.derived.userSubscriptionDetails) {
            const err = new Error(i18n_1.default.__('user_subscription.not_exists'));
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
            const userSubscription = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(body.user_uuid);
            if (userSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
            //
            //  check user have any pending subscription or not
            //
            const userApprovedSubscription = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(body.user_uuid);
            if (userApprovedSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_approved_state'));
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
            //  check company have any pending subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(body.company_uuid);
            if (companySubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
            //
            //  check company have any approved subscription or not
            //
            const companyApprovedSubscription = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(body.company_uuid);
            if (companyApprovedSubscription) {
                const err = new Error(i18n_1.default.__('subscription.already_in_approved_state'));
                err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                throw err;
            }
        }
        if (body.panel_type == 'USER') {
            //
            //  renew user subscription details
            //
            yield renewSubscription(container);
            //
            //  store result into container
            //
            container.output.message = i18n_1.default.__('subscription.renew_success');
        }
        else {
            //
            //  renew user subscription and add transaction details
            //
            yield renewSubscriptionByAdmin(container);
            //
            //  store result into container
            //
            container.output.message = i18n_1.default.__('subscription.admin_renew_success');
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
🚩 @uses : renew user subscription
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const renewSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { userSubscriptionDetails, subscriptionDetails } } = container;
        if (userSubscriptionDetails.subscription_uuid == body.subscription_uuid) {
            if (userSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
                const currentDate = moment_1.default.utc().format('YYYY-MM-DD');
                const startDate = (0, moment_1.default)(userSubscriptionDetails.start_date).format('YYYY-MM-DD');
                const endDate = (0, moment_1.default)(userSubscriptionDetails.end_date).format('YYYY-MM-DD');
                if (currentDate > endDate || currentDate < startDate) {
                    const updateSubscriptionStatus = {
                        status: constant_1.default.subscription_status.EXPIRED
                    };
                    //
                    //  update user subscription status
                    //
                    yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, updateSubscriptionStatus);
                }
            }
            //
            //  prepare data model to save user subscription
            //
            const saveUserSubscriptionDataModel = {
                subscription_uuid: body.subscription_uuid,
                user_uuid: body.user_uuid,
                company_uuid: body.company_uuid,
                status: constant_1.default.subscription_status.PENDING,
                subscription_status: constant_1.default.subscription_status.RENEWED,
                storage: body.storage,
                total_minutes: body.total_minutes,
                created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: logged_in_user.uuid
            };
            //
            //  save user subscription
            //
            const userSubscription = yield subscription_repo_1.default.saveUserSubscription(saveUserSubscriptionDataModel);
        }
        else {
            const err = new Error(i18n_1.default.__('subscription.upgrade_plan'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
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
🚩 @uses : renew user subscription from admin panel
🗓 @created : 05/06/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const renewSubscriptionByAdmin = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { userSubscriptionDetails, subscriptionDetails } } = container;
        if (userSubscriptionDetails && (0, moment_1.default)(body.start_date) <= (0, moment_1.default)(userSubscriptionDetails.end_date)) {
            const err = new Error(i18n_1.default.__('subscription.date_error'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        if (userSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
            const currentDate = moment_1.default.utc().format('YYYY-MM-DD');
            const startDate = (0, moment_1.default)(userSubscriptionDetails.start_date).format('YYYY-MM-DD');
            const endDate = (0, moment_1.default)(userSubscriptionDetails.end_date).format('YYYY-MM-DD');
            if (currentDate > endDate || currentDate < startDate) {
                const updateSubscriptionStatus = {
                    status: constant_1.default.subscription_status.EXPIRED
                };
                //
                //  update user subscription status
                //
                var subscriptionStatus = yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, updateSubscriptionStatus);
            }
        }
        //
        //  prepare data model to save user subscription
        //
        const saveUserSubscriptionDataModel = {
            subscription_uuid: body.subscription_uuid,
            user_uuid: body.user_uuid,
            company_uuid: body.company_uuid,
            storage: body.storage,
            total_minutes: body.total_minutes,
            start_date: body.start_date,
            end_date: body.end_date,
            next_billing_date: body.next_billing_date,
            user_access: body.user_access,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        if (subscriptionStatus && (subscriptionStatus.status == constant_1.default.subscription_status.DEACTIVE || subscriptionStatus.status == constant_1.default.subscription_status.EXPIRED)) {
            saveUserSubscriptionDataModel.status = constant_1.default.subscription_status.ACTIVE,
                saveUserSubscriptionDataModel.subscription_status = constant_1.default.subscription_status.RENEWED;
        }
        else {
            saveUserSubscriptionDataModel.status = constant_1.default.subscription_status.APPROVED,
                saveUserSubscriptionDataModel.subscription_status = constant_1.default.subscription_status.IS_FUTURE_RENEW;
        }
        //
        //  save user subscription
        //
        const userSubscription = yield subscription_repo_1.default.saveUserSubscription(saveUserSubscriptionDataModel);
        //
        //  generate six digit random hash code to store transaction id
        //
        const transactionId = yield auth_helper_1.default.generateSixDigitRandomHashCode();
        //
        //  prepare data model to save user tansaction
        //
        const saveUserTransactionDataModel = {
            user_subscription_uuid: userSubscription.uuid,
            file_uuid: body.file_uuid,
            price_amount: body.amount,
            transaction_id: transactionId,
            type: constant_1.default.payment_type.RENEW,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  save user transaction
        //
        const userTransaction = yield transaction_repo_1.default.saveTransaction(saveUserTransactionDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = renewSubscriptionService;
//# sourceMappingURL=renewSubscription.service.js.map