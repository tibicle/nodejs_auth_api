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
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Libraries
// import interface
class SubscriptionRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all subscription
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSubscriptions(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allSubscriptions = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION}`)
                    .select('*')
                    .where('status', '=', "ACTIVE")
                    .orderBy('created_at', 'asc');
                return allSubscriptions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get subscription by uuid
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSubscriptionByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [subscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION}`)
                    .where('uuid', uuid);
                return subscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserSubscription(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', uuid)
                    .andWhere('status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserActiveSubscription(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .select([
                    'us.uuid',
                    'us.status',
                    's.name',
                    'us.start_date',
                    'us.end_date',
                    'us.subscription_status',
                    'us.next_billing_date'
                ])
                    .where('us.user_uuid', uuid)
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .andWhere('us.status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save user subscription
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveUserSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .insert(data)
                    .returning('*');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user pending subscription by user uuid
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserPendingSubscriptionByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .andWhere('status', '=', 'PENDING')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get company pending subscription by user uuid
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyPendingSubscriptionByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', companyUuid)
                    .andWhere('status', '=', 'PENDING')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get current user subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCurrentUserSubscription(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .andWhere('status', 'ACTIVE')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list user subscription details
    🗓 @created : 23/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUsersSubscription(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let userSubscriptionQuery = (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .select('us.uuid', 'us.subscription_uuid', database_1.default.raw("CONCAT_WS(' ',u.first_name,u.last_name) as user_name"), 'c.name as organization_name', 's.name as plan_name', 'us.start_date', 'us.end_date', 'us.status', 'us.next_billing_date', 'us.user_uuid', 'us.company_uuid', 'us.subscription_status')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'us.company_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'us.created_by')
                    .orderBy('us.created_at', 'desc');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listUserSubscriptionFilters(container, userSubscriptionQuery);
                    let results = yield userSubscriptionQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'subscriptionData') {
                    userSubscriptionQuery
                        .select('us.uuid', 'us.subscription_uuid', database_1.default.raw("CONCAT_WS(' ',u.first_name,u.last_name) as user_name"), 'c.name as organization_name', 's.name as plan_name', 'us.start_date', 'us.end_date', 'us.status', 'us.next_billing_date', 'us.user_uuid', 'us.company_uuid', 'us.subscription_status');
                    //
                    //  search filter 
                    //
                    this.listUserSubscriptionFilters(container, userSubscriptionQuery);
                    if (query.per_page &&
                        query.page) {
                        userSubscriptionQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        userSubscriptionQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield userSubscriptionQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get current compnay subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCurrentCompanySubscription(compnayUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companySubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', compnayUuid)
                    .andWhere('status', 'ACTIVE')
                    .orderBy('created_at', 'desc');
                return companySubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list all user subscription filters
    🗓 @created : 23/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserSubscriptionFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by user name
                //
                if (query.user_name) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.user_name.toLowerCase()}%'`);
                }
                //
                //  filter by plan name
                //
                if (query.plan_name) {
                    searchQuery.whereRaw(`(LOWER("s"."name") LIKE '%${query.plan_name.toLowerCase()}%')`);
                }
                //
                //  filter by organization name
                //
                if (query.organization_name) {
                    searchQuery.whereRaw(`(LOWER("c"."name") LIKE '%${query.organization_name.toLowerCase()}%')`);
                }
                // 
                // filter data as per status
                // 
                if (query.status) {
                    searchQuery.where('us.status', `${query.status}`);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription details by user subscription uuid
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserSubscriptionByUuid(userSubscriptionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .select('us.uuid', 's.uuid as subscription_uuid', 's.name as name', database_1.default.raw(`
                        CASE 
                          WHEN p.price_amount IS NOT NULL THEN p.price_amount 
                          WHEN s.price = 'Custom' THEN NULL -- Handle the case where price is 'Custom', or return a default value
                          ELSE CAST(s.price AS REAL) 
                        END as price_amount
                      `), 'us.start_date', 'us.end_date', 'us.next_billing_date', 'us.created_at', 'us.user_access', 'us.status', 'c.name as company_name', database_1.default.raw("NULLIF(CONCAT_WS(' ', u.first_name, u.last_name), '') as user_name"), 'us.subscription_status', 'us.company_uuid', 'us.user_uuid', 'us.storage', 'us.total_minutes')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT} as p`, 'p.user_subscription_uuid', 'us.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'us.company_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'us.user_uuid')
                    .where('us.uuid', userSubscriptionUuid);
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check user subscription exists or not
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkUserSubscription(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('uuid', uuid)
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user subscription data
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserSubscription(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .update(data)
                    .where('uuid', uuid)
                    .returning('*');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save add on data
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveAddOn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [addOnData] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_ADDON}`)
                    .insert(data)
                    .returning('*');
                return addOnData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user last payment by user subscription uuid
    🗓 @created : 04/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserLastPayment(userSubscriptionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userLastPayment] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .select('created_at', 'price_amount')
                    .where('user_subscription_uuid', userSubscriptionUuid)
                    .orderBy('created_at', 'desc');
                return userLastPayment;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription renewed date
    🗓 @created : 05/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserSubscriptionRenewedDate(userSubscriptionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [renewDate] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .select('us.start_date')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT} as p`, 'p.user_subscription_uuid', 'us.uuid')
                    .where('us.uuid', userSubscriptionUuid)
                    .andWhere('us.subscription_status', '=', constant_1.default.subscription_status.IS_FUTURE_RENEW);
                return renewDate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Bhavya Nayak
   🚩 @uses : get user active subscription by user uuid
   🗓 @created : 21/05/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserActiveSubscriptionByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .andWhere('status', '=', 'ACTIVE')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get company active subscription by user uuid
    🗓 @created : 28/0/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyActiveSubscriptionByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', companyUuid)
                    .andWhere('status', '=', 'ACTIVE')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user subscription status
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserSubscriptionStatus(uuid, updateSubscriptionStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userStatus = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .update(updateSubscriptionStatus)
                    .where('uuid', uuid);
                return userStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get company active subscription
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompnayActiveSubscription(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .select([
                    'us.uuid',
                    'us.status',
                    's.name',
                    'us.start_date',
                    'us.end_date',
                    'us.subscription_status',
                    'us.next_billing_date'
                ])
                    .where('us.company_uuid', uuid)
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .andWhere('us.status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get current compnay subscription details
   🗓 @created : 21/05/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserSubscriptionDetails(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSubscriptionByCompanyUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', uuid)
                    .andWhere('status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanySubscription(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', uuid)
                    .andWhere('status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : get current compnay subscription details
  🗓 @created : 15/10/2024
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
    getUserSubscriptionAllDetails(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSubscription = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .orderBy('created_at', 'asc')
                    .limit(2);
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get current compnay subscription details
    🗓 @created : 21/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanySubscriptionAllDetails(compnayUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companySubscription = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', compnayUuid)
                    .orderBy('created_at', 'asc')
                    .limit(2);
                return companySubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get current compnay subscription details
   🗓 @created : 15/10/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserSubscriptionAllCurrentDetails(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSubscription = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .orderBy('created_at', 'asc')
                    .limit(2);
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get current compnay subscription details
   🗓 @created : 21/05/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanySubscriptionAllCurrentDetails(compnayUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companySubscription = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', compnayUuid)
                    .orderBy('created_at', 'desc')
                    .limit(2);
                return companySubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get user approved subscription by user uuid
    🗓 @created : 18/10/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserApprovedSubscriptionByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .andWhere('status', '=', 'APPROVED')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get company approved subscription by user uuid
   🗓 @created : 18/10/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanyApprovedSubscriptionByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', companyUuid)
                    .andWhere('status', '=', 'APPROVED')
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : sushant shekhar
   🚩 @uses : get company subscription details
   🗓 @created : 21/05/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanySubscriptionDetails(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', companyUuid)
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : sushant shekhar
    🚩 @uses : get company subscription details
    🗓 @created : 22/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllTeamMembers(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalMembers] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`)
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tm`, 'tm.team_uuid', 't.uuid')
                    .where('company_uuid', companyUuid)
                    .count('tm.uuid as total_members');
                return totalMembers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get company active subscription by user uuid
   🗓 @created : 28/0/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getCompanyActiveSubscriptionDetailsByCompanyUuid(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`)
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .select('s.name as plan_name')
                    .where('us.company_uuid', companyUuid)
                    .andWhere('us.status', '=', 'ACTIVE');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get transaction details using user subscription uuid
   🗓 @created : 25/010/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getTransactionDetailsByUserSubscriptionUuid(userSubscriptionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [payment] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .select('price_amount as price')
                    .where('user_subscription_uuid', userSubscriptionUuid)
                    .andWhere('type', null)
                    .orderBy('created_at', 'desc');
                return payment;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get current user subscription details
    🗓 @created : 08/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserCurrentSubscription(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .orderBy('created_at', 'desc');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get current user subscription details
    🗓 @created : 08/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyCurrentSubscription(compnayUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companySubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', compnayUuid)
                    .orderBy('created_at', 'desc');
                return companySubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get compnay pending subscription
    🗓 @created : 13/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyPendingSubscription(companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companySubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('company_uuid', companyUuid)
                    .andWhere('status', '=', 'PENDING');
                return companySubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user pending subscription
    🗓 @created : 13/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserPendingSubscription(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userSubscription] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION}`)
                    .where('user_uuid', userUuid)
                    .andWhere('status', '=', 'PENDING');
                return userSubscription;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get renew transaction details using user subscription uuid
    🗓 @created : 14/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getRenewTransactionDetailsByUserSubscriptionUuid(userSubscriptionUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [payment] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .select('price_amount as price')
                    .where('user_subscription_uuid', userSubscriptionUuid)
                    .andWhere('type', constant_1.default.payment_type.RENEW)
                    .orderBy('created_at', 'desc');
                return payment;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SubscriptionRepo();
//# sourceMappingURL=subscription.repo.js.map