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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const aiAssistant_repos_1 = __importDefault(require("../../aiAssistant/repos/aiAssistant.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create production service
🗓 @created : 30/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createProductionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN)) && !(logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR))) {
            //
            //  check user has subscription or not
            //
            yield validateActiveUserSubscription(container);
        }
        //
        //  validate name with company
        //
        yield checkName(container);
        //
        //  check category is present or not
        //
        //await checkCategory(container)
        //
        //  check tag is present or not
        //
        //await checkTag(container)
        //
        //  store production data
        //
        yield storeProductionData(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check user has active subscription or not
🗓 @created : 03/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateActiveUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { subscriptionDetails } } = container;
        const currentDate = moment_timezone_1.default.utc().format('YYYY-MM-DD');
        //
        //  check company exists or not if company_uuid is there
        //
        if (body.company_uuid && body.company_uuid != null) {
            yield company_repos_1.default.checkCompanyExists(body.company_uuid);
            //
            //  check company have any pending subscription or not
            //
            const companyPendingSubscription = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(body.company_uuid);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            //
            //  check company approved status
            //
            const companyApprovedStatus = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(body.company_uuid);
            if (companySubscription && companySubscription.status === constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (companyPendingSubscription) {
                if (companyPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || companyPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (companySubscription && companySubscription.status == 'ACTIVE' && (0, moment_timezone_1.default)(companySubscription.end_date).format('YYYY-MM-DD') < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(companySubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (companyApprovedStatus && companyApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!companySubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  check user have any pending subscription or not
            //
            const userPendingSubscription = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user approved status
            //
            const userApprovedStatus = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(logged_in_user.uuid);
            if (userSubscription && userSubscription.status == constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (userPendingSubscription) {
                if (userPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || userPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (userSubscription && userSubscription.status == 'ACTIVE' && moment_timezone_1.default.utc(userSubscription.end_date).format("YYYY-MM-DD") < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(userSubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (userApprovedStatus && userApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!userSubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
                err.statusCode = 400;
                throw err;
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
🚩 @uses : check name is already present with same company or not
🗓 @created : 1/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        if (body.company_uuid) {
            //
            //  check production exists or not in particular company
            //
            const companyProductionValidation = yield production_repo_1.default.validateProductionNameForCompany(body.name, body.company_uuid);
            if (companyProductionValidation) {
                const err = new Error(i18n_1.default.__("production.name_already_exist"));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  check production exists or not for self
            //
            const selfProductionValidation = yield production_repo_1.default.validateProductionNameForSelf(body.name, logged_in_user.uuid);
            if (selfProductionValidation) {
                const err = new Error(i18n_1.default.__("production.name_already_exist"));
                err.statusCode = 400;
                throw err;
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
🚩 @uses : check category is already present or not
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkCategory = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        // check category is present or not
        //
        container.derived.category = yield production_repo_1.default.validateCategory(body.category);
        if (!container.derived.category || container.derived.category == undefined) {
            //
            // if category not found throw error
            //
            const err = new Error(i18n_1.default.__("production.category_not_exist"));
            err.statusCode = 400;
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
👑 @creator : Sushant Shekhar
🚩 @uses : check tag is already present or not
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        if (body.tag || body.tag != null) {
            for (let i = 0; i < body.tag.length; i++) {
                //
                //  check tag is present or not
                //
                container.derived.tag = yield production_repo_1.default.validateTag(body.tag[i]);
                if (container.derived.tag) {
                    container.derived.tag_uuid.push(container.derived.tag.uuid);
                }
                if (!container.derived.tag || container.derived.tag == undefined) {
                    //
                    //  if tag not found insert new tag
                    //
                    container.derived.tagname = body.tag[i];
                    yield storeTag(container);
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
🚩 @uses : story new tag in tag database
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create category model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            type: constant_1.default.tag_type.PRODUCTION,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new category in category database
        //
        yield production_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in tag_uuid array
        //
        const getTagUuid = yield production_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.tag_uuid.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : store data in production database
🗓 @created : 18/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeProductionData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        // create production model
        //
        const productionModel = {
            company_uuid: body.company_uuid,
            user_uuid: logged_in_user.uuid,
            name: body.name,
            description: body.description,
            status: body.status,
            deadline: body.deadline,
            project_type: body.project_type,
            production_idea: body.production_idea,
            production_style: body.production_style,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: logged_in_user.uuid
        };
        //
        //  store model in database
        //
        container.derived.productionData = yield production_repo_1.default.storeProductionDetail(productionModel);
        //
        //  get sequence
        //
        let sequenceData = yield production_repo_1.default.getFirstSequence(container.derived.productionData.uuid);
        if (!sequenceData) {
            //
            //  prepare data model to add the sequence data
            //
            const saveSequenceDataModel = {
                production_uuid: container.derived.productionData.uuid,
                title: i18n_1.default.__('production.sequence_prefix'),
                last_selected: true,
                status: constant_1.default.sequence_status.PRE_PRODUCTION,
                created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: logged_in_user.uuid
            };
            //
            //  save sequence data
            //
            sequenceData = yield production_repo_1.default.saveSequence(saveSequenceDataModel);
        }
        //
        //  update production uuid in ai assistant 
        //
        if (body.fredo) {
            const threadIds = [];
            for (let id of body.fredo) {
                const threadId = yield aiAssistant_repos_1.default.getThreadByThreadId(id.thread_id);
                if (!threadId) {
                    const err = new Error(i18n_1.default.__('ai_assistant.thread_not_exist'));
                    err.statusCode = 400;
                    throw err;
                }
                threadIds.push(threadId.thread_id);
            }
            const updateAiAssistantModel = {
                production_uuid: container.derived.productionData.uuid
            };
            //
            // to update all the threads for same production
            //
            yield aiAssistant_repos_1.default.updateProductionUuidByThreadId(updateAiAssistantModel, threadIds);
        }
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('production.production_created');
        //
        //  add response data
        //
        container.output.result = { uuid: container.derived.productionData.uuid };
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createProductionService;
//# sourceMappingURL=createProduction.service.js.map