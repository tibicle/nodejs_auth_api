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
// Import Libraries
// Import services
//  Import Repo
const moment_1 = __importDefault(require("moment"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const subscription_repo_1 = __importDefault(require("../repo/subscription.repo"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const covertBytesToSize_helper_1 = __importDefault(require("../../../helpers/covertBytesToSize.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get current subscription details
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getCurrentSubscriptionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query } } = container;
        const currentDate = moment_1.default.utc().format('YYYY-MM-DD');
        if (query.user_uuid && query.user_uuid != null) {
            //
            //  check user exists or not
            //
            yield user_repo_1.default.getUserByUuid(query.user_uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(query.user_uuid);
            if (userSubscription && userSubscription.status == 'ACTIVE' && (0, moment_1.default)(userSubscription.end_date).format("YYYY-MM-DD") < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(userSubscription.uuid, updateStatusModel);
            }
            //
            //  get all team members count 
            //
            container.derived.allTeamMembers = 0;
        }
        if (query.company_uuid && query.company_uuid != null) {
            //
            //  check compnay exists or not
            //
            yield company_repos_1.default.checkCompanyExists(query.company_uuid);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(query.company_uuid);
            if (companySubscription && companySubscription.status == 'ACTIVE' && (0, moment_1.default)(companySubscription.end_date).format('YYYY-MM-DD') < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(companySubscription.uuid, updateStatusModel);
            }
            //
            //  get all team members in a company
            //
            container.derived.allTeamMembers = yield subscription_repo_1.default.getAllTeamMembers(query.company_uuid);
        }
        //
        //  get the current subscription details
        //
        yield currentSubscriptionDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : current subscription details
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const currentSubscriptionDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query } } = container;
        let tempActiveSubscription;
        let currentPlanDetails;
        if (query.user_uuid && query.user_uuid != null) {
            //
            //  get user current subscription details
            //
            container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getUserSubscriptionAllDetails(query.user_uuid);
            if (container.derived.currentSubscriptionDetails.length == 0) {
                container.output.result = {};
                return;
            }
            else if (container.derived.currentSubscriptionDetails.length == 1) {
                container.derived.currentPlanDetails = yield subscription_repo_1.default.getUserSubscriptionDetails(query.user_uuid);
                currentPlanDetails = container.derived.currentPlanDetails;
            }
            else {
                container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getUserSubscriptionAllCurrentDetails(query.user_uuid);
                container.derived.onlyActiveSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(query.user_uuid);
                if (container.derived.onlyActiveSubscription) {
                    currentPlanDetails = container.derived.onlyActiveSubscription;
                }
                else {
                    for (let updateSubscription of container.derived.currentSubscriptionDetails) {
                        //
                        // check that user has any active plan or not
                        //
                        const activePlan = container.derived.currentSubscriptionDetails.some((subscription) => subscription.status === constant_1.default.subscription_status.ACTIVE);
                        if (updateSubscription.status === constant_1.default.subscription_status.ACTIVE && activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                        else if (updateSubscription.status === constant_1.default.subscription_status.DEACTIVE && !activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                        else if (updateSubscription.status === constant_1.default.subscription_status.EXPIRED && !activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                    }
                }
            }
            //
            //  get user pending subscription details
            //  
            container.derived.pendingSubscriptionDetails = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(query.user_uuid);
        }
        if (query.company_uuid && query.company_uuid != null) {
            //
            //  get company current subscription details
            //
            container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getCompanySubscriptionAllDetails(query.company_uuid);
            if (container.derived.currentSubscriptionDetails.length == 0) {
                container.output.result = {};
                return;
            }
            else if (container.derived.currentSubscriptionDetails.length == 1) {
                container.derived.currentPlanDetails = yield subscription_repo_1.default.getCompanySubscriptionDetails(query.company_uuid);
                currentPlanDetails = container.derived.currentPlanDetails;
            }
            else {
                // //
                // //  check is there any status which is in APPROVED state
                // //
                // for(let subscription of container.derived.currentSubscriptionDetails){
                //     //
                //     //  check is there any status which is in APPROVED state
                //     //
                //     if(subscription.status == config.subscription_status.APPROVED){
                //         if(tempActiveSubscription){
                //             const currentDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                //             const startDate = moment(tempActiveSubscription.start_date).format('YYYY-MM-DD HH:mm:ss');
                //             const endDate = moment(tempActiveSubscription.end_date).format('YYYY-MM-DD HH:mm:ss');
                //             if(endDate < currentDate){
                //                 //
                //                 // prepare data model to make user subscription active
                //                 //
                //                 const changeStatusDataModel = {
                //                     status: config.subscription_status.EXPIRED,
                //                     updated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                //                     updated_by: logged_in_user.uuid
                //                 }
                //                 //
                //                 //  update user subscription data
                //                 //
                //                 await subscriptionRepo.updateUserSubscription(tempActiveSubscription.uuid,changeStatusDataModel);
                //             }
                //             if(moment(subscription.start_date).format('YYYY-MM-DD HH:mm:ss') >=  currentDate ){
                //                 //
                //                 // prepare data model to make user subscription active
                //                 //
                //                 const changeStatusDataModel = {
                //                     status: config.subscription_status.ACTIVE,
                //                     updated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                //                     updated_by: logged_in_user.uuid
                //                 }
                //                 //
                //                 //  update user subscription data
                //                 //
                //                 await subscriptionRepo.updateUserSubscription(subscription.uuid,changeStatusDataModel);
                //             }
                //         }
                //     }else if(subscription.status == config.subscription_status.ACTIVE || subscription.status == config.subscription_status.EXPIRED || subscription.status == config.subscription_status.DEACTIVE){
                //         tempActiveSubscription = subscription
                //     }
                //     else{
                //         continue;
                //     }
                // }
                //
                //  get company current subscription details
                //
                container.derived.currentSubscriptionDetails = yield subscription_repo_1.default.getCompanySubscriptionAllCurrentDetails(query.company_uuid);
                container.derived.onlyActiveSubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(query.company_uuid);
                if (container.derived.onlyActiveSubscription) {
                    currentPlanDetails = container.derived.onlyActiveSubscription;
                }
                else {
                    for (let updateSubscription of container.derived.currentSubscriptionDetails) {
                        //
                        // check that user has any active plan or not
                        //
                        const activePlan = container.derived.currentSubscriptionDetails.some((subscription) => subscription.status === constant_1.default.subscription_status.ACTIVE);
                        if (updateSubscription.status == constant_1.default.subscription_status.ACTIVE && activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            //
                            //  get company pending subscription details
                            //  
                            container.derived.pendingSubscriptionDetails = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(query.company_uuid);
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                        else if (updateSubscription.status == constant_1.default.subscription_status.DEACTIVE && !activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            //
                            //  get company pending subscription details
                            //  
                            container.derived.pendingSubscriptionDetails = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(query.company_uuid);
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                        else if (updateSubscription.status === constant_1.default.subscription_status.EXPIRED && !activePlan) {
                            container.derived.currentSubscriptionDetails = updateSubscription;
                            currentPlanDetails = container.derived.currentSubscriptionDetails;
                            break;
                        }
                    }
                }
            }
            //
            //  get company pending subscription details
            //  
            container.derived.pendingSubscriptionDetails = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(query.company_uuid);
        }
        // console.log("current plan details",currentPlanDetails);
        container.derived.currentSubscriptionDetails = currentPlanDetails;
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
        // if(currentSubscriptionDetails.end_date != null){
        //     let date = moment(currentSubscriptionDetails.end_date, 'YYYY-MM-DD HH:mm:ssZ');
        //     // Add one day
        //     date.add(1, 'days');
        //     var nextBillingDate:any = date.format('YYYY-MM-DD HH:mm:ssZ')
        // }else{
        //     var nextBillingDate:any = null
        // }
        // container.output.result = subscriptionDetails
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : prepare result and send response
🗓 @created : 22/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendResponse = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query }, derived: { currentSubscriptionDetails, subscriptionDetails } } = container;
        let transactionDetails;
        if (currentSubscriptionDetails && (currentSubscriptionDetails.subscription_status == constant_1.default.subscription_status.IS_FUTURE_RENEW || currentSubscriptionDetails.subscription_status == constant_1.default.subscription_status.RENEWED)) {
            //
            //  get transaction plan price when plan is renew 
            //
            transactionDetails = yield subscription_repo_1.default.getRenewTransactionDetailsByUserSubscriptionUuid(currentSubscriptionDetails.uuid);
        }
        else {
            //
            //  get transaction plan price 
            //
            transactionDetails = yield subscription_repo_1.default.getTransactionDetailsByUserSubscriptionUuid(currentSubscriptionDetails.uuid);
        }
        //
        //  prepare plan details response
        //
        const planDetails = {
            name: subscriptionDetails.name,
            description: subscriptionDetails.description,
            price: container.derived.pendingSubscriptionDetails ? (transactionDetails ? (`${transactionDetails.price}`) : subscriptionDetails.price) : (transactionDetails ? (`${transactionDetails.price}`) : subscriptionDetails.price),
            storage: `${currentSubscriptionDetails.storage} GB`,
            export_minutes: currentSubscriptionDetails.total_minutes,
            status: currentSubscriptionDetails.status,
            created_at: currentSubscriptionDetails.created_at,
            next_billing_date: currentSubscriptionDetails.next_billing_date,
            subscription_uuid: currentSubscriptionDetails.subscription_uuid,
            user_subscription_uuid: currentSubscriptionDetails.uuid,
            company_uuid: currentSubscriptionDetails.company_uuid ? currentSubscriptionDetails.company_uuid : null,
            user_uuid: currentSubscriptionDetails.user_uuid ? currentSubscriptionDetails.user_uuid : null,
            total_user: currentSubscriptionDetails.user_access,
            invited_members: container.derived.allTeamMembers.total_members ? container.derived.allTeamMembers.total_members : 0
        };
        // if(subscriptionDetails.name == config.subscription_plan.SOLO){
        //     planDetails.total_user = config.user_access.SOLO;
        // }
        // if(subscriptionDetails.name == config.subscription_plan.TEAM){
        //     planDetails.total_user = config.user_access.TEAM;
        // }
        // if(subscriptionDetails.name == config.subscription_plan.ENTERPRISE){
        //     planDetails.total_user = config.user_access.ENTERPRISE;
        // }
        if (container.derived.pendingSubscriptionDetails) {
            //
            //  get subscription details in pending 
            //
            container.derived.pendingSubscriptionFullDetail = yield subscription_repo_1.default.getSubscriptionByUuid(container.derived.pendingSubscriptionDetails.subscription_uuid);
        }
        if (query.company_uuid && query.company_uuid != null) {
            //
            //  get pending subscription status
            //
            var pendingSubscription = yield subscription_repo_1.default.getCompanyPendingSubscription(query.company_uuid);
            if (pendingSubscription) {
                //
                //  pending subscription plan details
                //
                var pendingSubscriptionPlanDetails = yield subscription_repo_1.default.getSubscriptionByUuid(pendingSubscription.subscription_uuid);
            }
        }
        if (query.user_uuid && query.user_uuid != null) {
            //
            //  get pending subscription details
            //
            var pendingSubscription = yield subscription_repo_1.default.getUserPendingSubscription(query.user_uuid);
            if (pendingSubscription) {
                //
                //  pending subscription plan details
                //
                var pendingSubscriptionPlanDetails = yield subscription_repo_1.default.getSubscriptionByUuid(pendingSubscription.subscription_uuid);
            }
        }
        //
        //  add keys in object to identify is there any pending subscription is present
        //
        planDetails.is_Pending = pendingSubscription ? true : false;
        planDetails.pending_plan_description = pendingSubscriptionPlanDetails ? pendingSubscriptionPlanDetails.description : null;
        planDetails.pending_plan_name = pendingSubscriptionPlanDetails ? pendingSubscriptionPlanDetails.name : null;
        planDetails.pending_plan_status = pendingSubscription ? pendingSubscription.status : null;
        planDetails.pending_plan_price = pendingSubscriptionPlanDetails ? pendingSubscriptionPlanDetails.price : null;
        planDetails.pending_plan_date = pendingSubscription ? pendingSubscription.created_at : null;
        planDetails.pending_plan_is_popular = pendingSubscriptionPlanDetails ? pendingSubscriptionPlanDetails.is_popular : null;
        // }
        if (((currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.PENDING) || (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.DEACTIVE) || (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.EXPIRED)) ||
            ((currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.PENDING) || (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.DEACTIVE) || (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.EXPIRED))) {
            const usageDetails = {
                library_usage: "0 Bytes",
                production_usage: "0 Bytes",
                total_minutes: 0,
                user_individual_usage: null,
                total_used_storage: "0 Bytes"
            };
            // container.output.result.plan_details = planDetails
            container.output.result.usage_details = usageDetails ? usageDetails : null;
        }
        //
        //  get the usage details for user
        //
        if (currentSubscriptionDetails.user_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
            //
            //  get all the production by user uuid
            //
            const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
            //
            //  compare date logic
            //
            const givenDate = (0, moment_1.default)(currentSubscriptionDetails.start_date);
            const currentMonth = (0, moment_1.default)().month();
            const planCurrentMonth = givenDate.month();
            var planStartDate;
            if (planCurrentMonth == currentMonth) {
                planStartDate = currentSubscriptionDetails.start_date;
            }
            else {
                planStartDate = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
            }
            //
            //  get all library by user uuid
            //
            const libraryUuid = yield library_repo_1.default.getLibraryByUserUuid(currentSubscriptionDetails.user_uuid);
            const totalUserMinutes = yield export_repo_1.default.getExportTotalMinutesDate(productionUuid, currentSubscriptionDetails.user_uuid, planStartDate);
            const totalUserMinutesC = yield export_repo_1.default.getExportTotalMinutesWithUserUsage(productionUuid);
            //
            //  get user library usage
            //
            const libraryUsage = yield library_repo_1.default.getUserLibraryUsage(libraryUuid);
            //
            //  get user production usage
            //
            const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
            const totalLibraryUsage = libraryUsage.total_usage ? parseInt(libraryUsage.total_usage) : 0;
            const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
            const librarySize = yield covertBytesToSize_helper_1.default.convertBytes(totalLibraryUsage);
            const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
            const totalUsage = totalProductionUsage + totalLibraryUsage;
            const totalUsedStorage = yield covertBytesToSize_helper_1.default.convertBytes(totalUsage);
            const usageDetails = {
                library_usage: librarySize ? librarySize : "0 Bytes",
                production_usage: productionSize ? productionSize : "0 Bytes",
                total_minutes: parseInt(totalUserMinutes.sum) ? parseInt(totalUserMinutes.sum) : 0,
                user_individual_usage: totalUserMinutesC.length > 0 ? totalUserMinutesC : null,
                total_used_storage: totalUsedStorage ? totalUsedStorage : "0 Bytes"
            };
            // container.output.result.plan_details = planDetails
            container.output.result.usage_details = usageDetails ? usageDetails : null;
        }
        //
        //  get the usage details for company
        //
        if (currentSubscriptionDetails.company_uuid && currentSubscriptionDetails.status == constant_1.default.subscription_status.ACTIVE) {
            //
            //  get all the production by user uuid
            //
            const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
            const givenDate = (0, moment_1.default)(currentSubscriptionDetails.start_date);
            const currentMonth = (0, moment_1.default)().month();
            const planCurrentMonth = givenDate.month();
            var planStartDate;
            if (planCurrentMonth == currentMonth) {
                planStartDate = currentSubscriptionDetails.start_date;
            }
            else {
                planStartDate = (0, moment_1.default)().startOf('month').format('YYYY-MM-DD');
            }
            const totalUserMinutes = yield export_repo_1.default.getExportTotalMinutesWithUserUsageDetail(productionUuid, planStartDate);
            const totalUserMinutesC = yield export_repo_1.default.getExportTotalMinutesWithUserUsage(productionUuid);
            //
            //  get all the library by user uuid
            //
            const libraryUuid = yield library_repo_1.default.getAllLibraryByCompanyUuid(currentSubscriptionDetails.company_uuid);
            //
            //  get user library usage
            //
            const libraryUsage = yield library_repo_1.default.getUserLibraryUsage(libraryUuid);
            //
            //  get user production usage
            //
            const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
            const totalLibraryUsage = libraryUsage.total_usage ? parseInt(libraryUsage.total_usage) : 0;
            const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
            const librarySize = yield covertBytesToSize_helper_1.default.convertBytes(totalLibraryUsage);
            const productionSize = yield covertBytesToSize_helper_1.default.convertBytes(totalProductionUsage);
            const totalUsage = totalProductionUsage + totalLibraryUsage;
            const totalUsedStorage = yield covertBytesToSize_helper_1.default.convertBytes(totalUsage);
            const totalSum = totalUserMinutes
                .map(item => item.total_time !== null ? parseInt(item.total_time, 10) : 0)
                .reduce((sum, value) => sum + value, 0);
            const usageDetails = {
                library_usage: librarySize ? librarySize : "0 Bytes",
                production_usage: productionSize ? productionSize : "0 Bytes",
                total_minutes: totalSum ? totalSum : 0,
                user_individual_usage: totalUserMinutesC.length > 0 ? totalUserMinutesC : null,
                total_used_storage: totalUsedStorage ? totalUsedStorage : "0 Bytes"
            };
            container.output.result.usage_details = usageDetails ? usageDetails : null;
        }
        container.output.result.plan_details = planDetails;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getCurrentSubscriptionService;
//# sourceMappingURL=getCurrentSubscription.service.js.map