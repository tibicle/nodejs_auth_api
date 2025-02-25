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
const user_repo_1 = __importDefault(require("../repos/user.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const covertBytesToSize_helper_1 = __importDefault(require("../../../helpers/covertBytesToSize.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get user details by uuid
🗓 @created : 26/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUserDetailsByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query }, } = container;
        //
        //  check user exists or not
        //
        yield user_repo_1.default.getUserByUuid(params.uuid);
        //
        //  get user details by Uuid
        //
        const result = yield user_repo_1.default.getUsersDetails(params.uuid);
        if (result.organization == null) {
            result.organization = [];
        }
        //
        //  set the result in in container
        //
        container.output.result = result;
        //
        //  get user current subscription details
        //
        const currentSubscriptionDetails = yield subscription_repo_1.default.getCurrentUserSubscription(params.uuid);
        if (currentSubscriptionDetails) {
            var subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(currentSubscriptionDetails.subscription_uuid);
            //
            //  get transaction plan price 
            //
            var transactionDetails = yield subscription_repo_1.default.getTransactionDetailsByUserSubscriptionUuid(currentSubscriptionDetails.uuid);
        }
        //
        //  get all the production by user uuid
        //
        const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(params.uuid);
        //
        //  get all library by user uuid
        //
        const libraryUuid = yield library_repo_1.default.getLibraryByUserUuid(params.uuid);
        //
        //  get user library usage
        //
        const libraryUsage = yield library_repo_1.default.getUserLibraryUsage(libraryUuid);
        //
        //  get user production usage
        //
        const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
        const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
        const totalLibraryUsage = libraryUsage.total_usage ? parseInt(libraryUsage.total_usage) : 0;
        const totalUsage = totalProductionUsage + totalLibraryUsage;
        const totalUsedStorage = yield covertBytesToSize_helper_1.default.convertBytes(totalUsage);
        //
        //  todo 
        //  dynamic the subscription response
        result.subscription = {
            current_plan: subscriptionDetails ? subscriptionDetails.name : null,
            amount: transactionDetails ? transactionDetails.price : (subscriptionDetails ? subscriptionDetails.price : null),
            billing_period: 'Monthly',
            purchase_date: currentSubscriptionDetails ? currentSubscriptionDetails.created_at : null,
            expired_on: currentSubscriptionDetails ? currentSubscriptionDetails.end_date : null
        };
        //
        //  todo
        //  dynamic the s3 storage response
        result.s3_storage = {
            available_storage: currentSubscriptionDetails ? `${currentSubscriptionDetails.storage} GB` : '0 GB',
            used_storage: totalUsedStorage ? totalUsedStorage : "0 Bytes"
        };
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getUserDetailsByUuid;
//# sourceMappingURL=getUserDetailsByUuid.service.js.map