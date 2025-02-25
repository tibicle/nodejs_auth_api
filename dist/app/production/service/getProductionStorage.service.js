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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
const covertBytesToSize_helper_1 = __importDefault(require("../../../helpers/covertBytesToSize.helper"));
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get prodcution storage serivce
🗓 @created : 09/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getProductionStorageService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        if (query.user_uuid && query.user_uuid != null) {
            //
            //  get user current subscription details
            //
            container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getCurrentUserSubscription(query.user_uuid);
            if (!container.derived.currentSubscriptionDetails) {
                container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getUserCurrentSubscription(query.user_uuid);
            }
        }
        if (query.company_uuid && query.company_uuid != null) {
            //
            //  get company current subscription details
            //
            container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getCurrentCompanySubscription(query.company_uuid);
            if (!container.derived.currentSubscriptionDetails) {
                container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getCompanyCurrentSubscription(query.company_uuid);
            }
        }
        if (container.derived.currentSubscriptionDetails) {
            //
            //  get subscription details
            //
            container.derived.subscriptionDetails = yield subscription_repo_1.default.getSubscriptionByUuid(container.derived.currentSubscriptionDetails.subscription_uuid);
            //
            //  prepare result and send response
            //
            yield sendResponse(container);
        }
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : check the production storage on user and compnay basis and send the response
🗓 @created : 09/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendResponse = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query }, derived: { currentSubscriptionDetails, subscriptionDetails } } = container;
        var usageDetails;
        if (query.user_uuid && query.user_uuid != null) {
            //
            //  get the usage details for user
            //
            if (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else if (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.EXPIRED) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else if (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.APPROVED) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else {
                usageDetails = {
                    production_usage: '0 Bytes',
                    total_storage: '0 GB'
                };
            }
        }
        if (query.company_uuid && query.company_uuid != null) {
            //
            //  get the usage details for company
            //
            if (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else if (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.EXPIRED) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else if (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.APPROVED) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
                usageDetails = {
                    production_usage: productionSize,
                    total_storage: `${currentSubscriptionDetails.storage} GB`
                };
            }
            else {
                usageDetails = {
                    production_usage: '0 Bytes',
                    total_storage: '0 GB'
                };
            }
        }
        container.output.result = usageDetails;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getProductionStorageService;
//# sourceMappingURL=getProductionStorage.service.js.map