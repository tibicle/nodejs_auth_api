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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Libraries
// Import services
//  Import Repo
const http_status_codes_1 = require("http-status-codes");
const subscription_repo_1 = __importDefault(require("../repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get user subscription details by uuid
🗓 @created : 24/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const userSubcriptionByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params } } = container;
        //
        //  check user subscription exists or not
        //
        const userSubscription = yield subscription_repo_1.default.checkUserSubscription(params.user_subscription_uuid);
        if (!userSubscription) {
            const err = new Error(i18n_1.default.__('user_subscription.not_exists'));
            err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            throw err;
        }
        // 
        //  get user subscription details by uuid and store the result
        // 
        const data = yield subscription_repo_1.default.getUserSubscriptionByUuid(params.user_subscription_uuid);
        //
        //  get user last payment date
        //
        const lastPayment = yield subscription_repo_1.default.getUserLastPayment(params.user_subscription_uuid);
        //
        //  get user subscription renew date if exists
        //
        const renewDate = yield subscription_repo_1.default.getUserSubscriptionRenewedDate(params.user_subscription_uuid);
        data.expired_on = data.end_date ? data.end_date : null;
        data.last_payment_date = lastPayment ? lastPayment.created_at : null;
        data.last_payment_amount = lastPayment ? lastPayment.price_amount : null;
        data.renew_date = renewDate ? renewDate.start_date : null;
        data.billing_period = "Monthly";
        //
        //  get subscription details
        //
        const subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(data.subscription_uuid);
        if (subscriptionDetails.name == constant_1.default.subscription_plan.SOLO) {
            data.user_access = userSubscription.user_access ? userSubscription.user_access : constant_1.default.user_access.SOLO;
            data.plan_message = null;
        }
        else if (subscriptionDetails.name == constant_1.default.subscription_plan.TEAM) {
            data.user_access = userSubscription.user_access ? userSubscription.user_access : constant_1.default.user_access.TEAM;
            data.plan_message = null;
        }
        else if (subscriptionDetails.name == constant_1.default.subscription_plan.ENTERPRISE) {
            data.user_access = userSubscription.user_access ? userSubscription.user_access : constant_1.default.user_access.ENTERPRISE;
            data.storage = userSubscription ? (parseInt(userSubscription.storage) > 0 ? userSubscription.storage : '0') : '0';
            data.total_minutes = userSubscription ? (parseInt(userSubscription.total_minutes) > 0 ? userSubscription.total_minutes : '0') : '0';
            data.plan_message = "usage_based";
        }
        container.output.result = data;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = userSubcriptionByUuid;
//# sourceMappingURL=getUserSubscriptionDetailsByUuid.service.js.map