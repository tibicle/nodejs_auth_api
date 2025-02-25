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
const i18n_1 = __importDefault(require("../../../config/i18n"));
const http_status_codes_1 = require("http-status-codes");
// Import Libraries
// import interface
class TransactionRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save transaction
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [transaction] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .insert(data)
                    .returning('*');
                return transaction;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update transaction
    🗓 @created : 24/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTransaction(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [transaction] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .update(data)
                    .where('user_subscription_uuid', uuid)
                    .returning('*');
                return transaction;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list user transaction details
    🗓 @created : 23/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUsersTransaction(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let userSubscriptionQuery = (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT} as p`)
                    .distinct('p.uuid', 'p.transaction_id', 'c.name as organization_name', 's.name as plan_name', 'us.start_date', 'us.end_date', 'us.status', 'us.next_billing_date', 'u.uuid as user_uuid', 'c.uuid as company_uuid', 'p.price_amount as amount', 'p.created_at')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/transaction', f.name)) ELSE NULL END as invoice_url`))
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_SUBSCRIPTION} as us`, 'us.uuid', 'p.user_subscription_uuid')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.SUBSCRIPTION} as s`, 's.uuid', 'us.subscription_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'us.company_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'us.user_uuid')
                    .leftJoin(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.USER_ADDON} as ua`, 'ua.user_subscription_uuid', 'p.user_subscription_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'p.file_uuid')
                    .orderBy('p.created_at', 'desc');
                if (query.company_uuid) {
                    userSubscriptionQuery.where('us.company_uuid', query.company_uuid);
                }
                if (query.user_uuid) {
                    userSubscriptionQuery.where('us.user_uuid', query.user_uuid);
                }
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listUserTransactionFilters(container, userSubscriptionQuery);
                    let results = yield userSubscriptionQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'transactionData') {
                    userSubscriptionQuery
                        .distinct('p.uuid', 'p.transaction_id', 'c.name as organization_name', 's.name as plan_name', 'us.start_date', 'us.end_date', 'us.status', 'us.next_billing_date', 'u.uuid as user_uuid', 'c.uuid as company_uuid', 'p.price_amount as amount', 'p.created_at');
                    //
                    //  search filter 
                    //
                    this.listUserTransactionFilters(container, userSubscriptionQuery);
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
    🚩 @uses : list all user transaction filters
    🗓 @created : 23/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserTransactionFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by transaction id
                //
                if (query.transaction_id) {
                    searchQuery.whereRaw(`(LOWER("p"."transaction_id") LIKE '%${query.transaction_id.toLowerCase()}%')`);
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
    🚩 @uses : check transaction
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkTransaction(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [transaction] = yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .where('uuid', uuid);
                if (!transaction) {
                    const err = new Error(i18n_1.default.__('transaction.not_exists'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                return transaction;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete transaction
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteTransaction(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.SUBSCRIPTIONS}.${constant_1.default.tables.PAYMENT}`)
                    .where('uuid', uuid)
                    .del();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new TransactionRepo();
//# sourceMappingURL=transaction.repo.js.map