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
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
// Import Third-party 
const http_status_codes_1 = require("http-status-codes");
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : cancel subscription service
🗓 @created : 05/06/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const cancelSubscriptionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body } } = container;
        //
        //  get user active subscription details
        //
        container.derived.userSubscriptionDetails = yield subscription_repo_1.default.checkUserSubscription(body.user_subscription_uuid);
        if (!container.derived.userSubscriptionDetails) {
            const err = new Error(i18n_1.default.__('user_subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        if (container.derived.userSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
            //
            //  prepare data model to update user subscription data
            //
            const cancelSubscriptionDataModel = {
                status: constant_1.default.status.DEACTIVE,
                subscription_status: constant_1.default.subscription_status.CANCELED
            };
            yield subscription_repo_1.default.updateUserSubscription(body.user_subscription_uuid, cancelSubscriptionDataModel);
        }
        else if (container.derived.userSubscriptionDetails.status == constant_1.default.subscription_status.PENDING) {
            //
            //  prepare data model to update user subscription data
            //
            const cancelSubscriptionDataModel = {
                status: constant_1.default.status.DEACTIVE,
                subscription_status: constant_1.default.subscription_status.CANCELED
            };
            yield subscription_repo_1.default.updateUserSubscription(body.user_subscription_uuid, cancelSubscriptionDataModel);
        }
        else if (container.derived.userSubscriptionDetails.status == constant_1.default.subscription_status.APPROVED) {
            //
            //  prepare data model to update user subscription data
            //
            const cancelSubscriptionDataModel = {
                status: constant_1.default.status.DEACTIVE,
                subscription_status: constant_1.default.subscription_status.CANCELED
            };
            yield subscription_repo_1.default.updateUserSubscription(body.user_subscription_uuid, cancelSubscriptionDataModel);
        }
        //
        //  store result into container
        //
        container.output.message = i18n_1.default.__('subscription.cancel_success');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = cancelSubscriptionService;
//# sourceMappingURL=cancelSubscription.service.js.map