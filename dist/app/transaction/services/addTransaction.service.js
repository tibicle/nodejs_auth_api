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
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const transaction_repo_1 = __importDefault(require("../repo/transaction.repo"));
// Import Third-party 
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save transaction service
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveTransactionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  check user subscription exists or not
        //
        container.derived.subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(body.subscription_uuid);
        //
        //  check storage should be greater than 0
        //
        yield validateBodyValues(container);
        if (!container.derived.subscriptionDetails) {
            const err = new Error(i18n_1.default.__('subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  get user subscription details
        //
        container.derived.userSubscriptionDetails = yield subscription_repo_1.default.checkUserSubscription(body.user_subscription_uuid);
        if (!container.derived.userSubscriptionDetails) {
            const err = new Error(i18n_1.default.__('user_subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  check if file exists or not
        //
        if (body.file_uuid && body.file_uuid != null) {
            //
            //  check file uuid exists or not
            //
            yield file_repo_1.default.checkFile(body.file_uuid);
        }
        //
        //  validate user has already buy any subscription currently active
        //
        yield validateActiveUserSubscription(container);
        //
        //  save user transaction details
        //
        yield saveUserTransaction(container);
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('transaction.save_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save user transaction details
🗓 @created : 27/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserTransaction = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails, userSubscriptionDetails } } = container;
        //
        //  generate six digit random hash code to store transaction id
        //
        const transactionId = yield auth_helper_1.default.generateSixDigitRandomHashCode();
        //
        //  prepare data model to save user tansaction
        //
        const saveUserTransactionDataModel = {
            user_subscription_uuid: body.user_subscription_uuid,
            file_uuid: body.file_uuid,
            price_amount: body.amount,
            transaction_id: transactionId,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  check total minutes
        //
        if (userSubscriptionDetails.total_minutes != body.total_minutes) {
            //
            //  prepare data model to update user total minutes
            //
            const totalMinutesDataModel = {
                total_minutes: body.total_minutes
            };
            //
            //  update user subscription data
            //
            yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, totalMinutesDataModel);
        }
        //
        //  check the storage
        //
        if (userSubscriptionDetails.storage != body.storage) {
            //
            //  prepare data model to update user storage
            //
            const storageDataModel = {
                storage: body.storage
            };
            //
            //  update user subscription data
            //
            yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, storageDataModel);
        }
        //
        //  prepare data model to update user start date , end date , next billing date
        //
        const updateUserSubscriptionDateDataModel = {
            start_date: body.start_date,
            end_date: body.end_date,
            next_billing_date: body.next_billing_date,
            user_access: body.user_access
        };
        //
        //  update user subscription data
        //
        yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, updateUserSubscriptionDateDataModel);
        if (userSubscriptionDetails.subscription_status == constant_1.default.subscription_status.RENEWED) {
            saveUserTransactionDataModel.type = constant_1.default.payment_type.RENEW;
        }
        //
        //  save user transaction
        //
        const userTransaction = yield transaction_repo_1.default.saveTransaction(saveUserTransactionDataModel);
        if (body.file_uuid && body.file_uuid != null) {
            //
            //  update file table
            //
            const updateFileDataModel = {
                ref_uuid: userTransaction.uuid,
                ref_type: 'INVOICE',
                updated_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            //
            //  update file data
            //
            yield file_repo_1.default.updateFiledata(body.file_uuid, updateFileDataModel);
        }
        const startDate = moment_1.default.utc(body.start_date).format('YYYY-MM-DD');
        const currentDate = (0, moment_1.default)().utc().format('YYYY-MM-DD');
        //
        // prepare data model to make user subscription active
        //
        const changeStatusDataModel = {
            status: userSubscriptionDetails.subscription_status == constant_1.default.subscription_status.RENEWED ? constant_1.default.subscription_status.APPROVED : (startDate > currentDate ? constant_1.default.subscription_status.APPROVED : constant_1.default.subscription_status.ACTIVE)
        };
        //
        //  update user subscription data
        //
        yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, changeStatusDataModel);
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
        const { input: { body, logged_in_user }, derived: { subscriptionDetails, userSubscriptionDetails } } = container;
        //
        //  validate either user uuid is in body or company uuid
        //
        if (!body.user_uuid && !body.company_uuid) {
            const err = new Error(i18n_1.default.__('subscription.user_or_company_not_exist'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  find the difference 
        //
        const startDate = (0, moment_1.default)(body.start_date);
        const endDate = (0, moment_1.default)(body.end_date);
        const diffDays = endDate.diff(startDate, 'days');
        if (diffDays < 2) {
            const err = new Error(i18n_1.default.__('subscription.days_greater'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  check user exists or not if user_uuid is there
        //
        if (body.user_uuid && body.user_uuid != null) {
            yield user_repo_1.default.getUserByUuid(body.user_uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(body.user_uuid);
            if (userSubscriptionDetails.subscription_status === constant_1.default.subscription_status.RENEWED) {
                if (userSubscription && (0, moment_1.default)(body.start_date) <= (0, moment_1.default)(userSubscription.end_date)) {
                    const err = new Error(i18n_1.default.__('subscription.date_error'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
            }
            if (userSubscriptionDetails.subscription_status !== constant_1.default.subscription_status.RENEWED) {
                if (userSubscription && userSubscription.status == 'ACTIVE' && userSubscription.subscription_uuid != subscriptionDetails.uuid) {
                    let userSubscriptionModel = {
                        status: 'DEACTIVE'
                    };
                    yield subscription_repo_1.default.updateUserSubscription(userSubscription.uuid, userSubscriptionModel);
                }
                else if (userSubscription && userSubscription.status !== 'DEACTIVE') {
                    const err = new Error(i18n_1.default.__('subscription.already_in_active_state'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
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
            if (userSubscriptionDetails.subscription_status === constant_1.default.subscription_status.RENEWED) {
                if (companySubscription && (0, moment_1.default)(body.start_date) <= (0, moment_1.default)(companySubscription.end_date)) {
                    const err = new Error(i18n_1.default.__('subscription.date_error'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
            }
            if (userSubscriptionDetails.subscription_status !== constant_1.default.subscription_status.RENEWED) {
                if (companySubscription && companySubscription.status == 'ACTIVE' && companySubscription.subscription_uuid != subscriptionDetails.uuid) {
                    let companySubscriptionModel = {
                        status: 'DEACTIVE'
                    };
                    yield subscription_repo_1.default.updateUserSubscription(companySubscription.uuid, companySubscriptionModel);
                }
                else if (companySubscription && companySubscription.status !== 'DEACTIVE') {
                    const err = new Error(i18n_1.default.__('subscription.already_in_active_state'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
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
👑 @creator : Sushant Shekhar
🚩 @uses : validate user body value
🗓 @created : 28/08/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateBodyValues = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  check storage,usage,total minutes should be greater than 0
        //
        if (parseInt(body.amount) == 0 || parseInt(body.total_minutes) == 0 || parseInt(body.storage) == 0 || parseInt(body.user_access) == 0) {
            const err = new Error(i18n_1.default.__('subscription.value_should_greater'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveTransactionService;
//# sourceMappingURL=addTransaction.service.js.map