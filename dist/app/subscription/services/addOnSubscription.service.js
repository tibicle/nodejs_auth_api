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
const transaction_repo_1 = __importDefault(require("../../transaction/repo/transaction.repo"));
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
const addOnSubscriptionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  get user subscription details
        //
        container.derived.userSubscriptionDetails = yield subscription_repo_1.default.checkUserSubscription(body.user_subscription_uuid);
        if (!container.derived.userSubscriptionDetails) {
            const err = new Error(i18n_1.default.__('user_subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        if (moment_1.default.utc(body.end_date).format('YYYY-MM-DD') > moment_1.default.utc(container.derived.userSubscriptionDetails.end_date).format('YYYY-MM-DD')) {
            const err = new Error(i18n_1.default.__('subscription.cannot_add_on'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        //
        //  validate value should not be 0
        //
        yield validateBodyValues(container);
        //
        //  save user add on details
        //
        yield saveUserAddOn(container);
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('subscription.add_on_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save user add on details
🗓 @created : 27/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserAddOn = (container) => __awaiter(void 0, void 0, void 0, function* () {
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
            type: constant_1.default.payment_type.ADDON,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        if (body.storage && body.storage != null) {
            //
            //  convert string to int
            //
            var userStorage = parseInt(userSubscriptionDetails.storage);
            var addStorage = parseInt(body.storage);
            var updatedStorage = userStorage + addStorage;
        }
        //
        //  prepare data model to update user subscription data
        //
        const addOnSubscriptionDataModel = {
            total_minutes: userSubscriptionDetails.total_minutes ? parseInt(userSubscriptionDetails.total_minutes) + parseInt(body.total_minutes) : body.total_minutes,
            storage: updatedStorage ? updatedStorage : body.storage,
            user_access: userSubscriptionDetails.user_access ? parseInt(userSubscriptionDetails.user_access) + parseInt(body.user_access) : body.user_access
        };
        //
        //  update user subscription data
        //
        yield subscription_repo_1.default.updateUserSubscription(userSubscriptionDetails.uuid, addOnSubscriptionDataModel);
        //
        //  save user transaction
        //
        const userTransaction = yield transaction_repo_1.default.saveTransaction(saveUserTransactionDataModel);
        //
        //  prepare data model to save add on
        //
        const addOnDataModel = {
            user_subscription_uuid: body.user_subscription_uuid,
            start_date: body.start_date,
            end_date: body.end_date,
            created_at: moment_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  save add on
        //
        yield subscription_repo_1.default.saveAddOn(addOnDataModel);
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
        if (parseInt(body.amount) == 0 || parseInt(body.storage) == 0 || parseInt(body.storage) == 0 || parseInt(body.user_access) == 0) {
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
exports.default = addOnSubscriptionService;
//# sourceMappingURL=addOnSubscription.service.js.map