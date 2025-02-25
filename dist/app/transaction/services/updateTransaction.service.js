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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const transaction_repo_1 = __importDefault(require("../repo/transaction.repo"));
// Import Third-party 
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update transaction service
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateTransactionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
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
        //  update user transaction details
        //
        yield updateUserTransaction(container);
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('transaction.update_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update user transaction details
🗓 @created : 27/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateUserTransaction = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails, userSubscriptionDetails } } = container;
        //
        //  prepare data model to update user tansaction
        //
        const saveUserTransactionDataModel = {
            file_uuid: body.file_uuid,
            price_amount: body.amount,
            updated_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
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
            next_billing_date: body.next_billing_date
        };
        //
        //  update user subscription data
        //
        yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, updateUserSubscriptionDateDataModel);
        //
        //  save user transaction
        //
        const userTransaction = yield transaction_repo_1.default.updateTransaction(body.user_subscription_uuid, saveUserTransactionDataModel);
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
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateTransactionService;
//# sourceMappingURL=updateTransaction.service.js.map