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
// Import config
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
const moment_1 = __importDefault(require("moment"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
class aiAssistantRepos {
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : check user exist
    * 🗓 Created : 01/10/2024
    */
    getUserByUserUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('uuid', uuid);
                return user;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get user thread
    * 🗓 Created : 01/10/2024
    */
    getThreadByUserUuid(uuid, field_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twentyFourHoursAgo = moment_1.default.utc().subtract(24, 'hours').toISOString();
                const [thread] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .where('user_uuid', uuid)
                    .andWhere('field_id', field_id)
                    .andWhere('company_uuid', null)
                    .andWhere('created_at', '>=', twentyFourHoursAgo);
                return thread;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get user thread
    * 🗓 Created : 03/10/2024
    */
    getThreadByCompanyUuid(uuid, field_id, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twentyFourHoursAgo = moment_1.default.utc().subtract(24, 'hours').toISOString();
                const [thread] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .where('company_uuid', uuid)
                    .andWhere('field_id', field_id)
                    .andWhere('user_uuid', userUuid)
                    .andWhere('created_at', '>=', twentyFourHoursAgo);
                return thread;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : store thread
    * 🗓 Created : 03/10/2024
    */
    storeThread(threadModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .insert(threadModel)
                    .returning("*");
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get company details
    * 🗓 Created : 03/10/2024
    */
    getCompanyByCompanyUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY}`)
                    .select('uuid')
                    .where('uuid', uuid);
                if (!company) {
                    const err = new Error(i18n_1.default.__('company.no_company_exist'));
                    err.statusCode = 400;
                    throw err;
                }
                return company;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get thread
    * 🗓 Created : 03/10/2024
    */
    getThreadByThreadId(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twentyFourHoursAgo = moment_1.default.utc().subtract(24, 'hours').toISOString();
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .where('thread_id', threadId)
                    .andWhere('created_at', '>=', twentyFourHoursAgo);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getThreadByProductionUuid(company, field_id, production) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .where('company_uuid', company)
                    .andWhere('field_id', field_id)
                    .andWhere('production_uuid', production);
                // if(!production){
                //     const err:any = new Error(i18n.__('production.no_production_exists'));
                //     err.statusCode = 400;
                //     throw err;
                // }
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getThreadByUserProductionUuid(user, field_id, production) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .where('user_uuid', user)
                    .andWhere('field_id', field_id)
                    .andWhere('production_uuid', production);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get user profile
    * 🗓 Created : 03/10/2024
    */
    getDetailsForUserMessage(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userMessage] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .where('user_uuid', uuid);
                if (!userMessage) {
                    const err = new Error(i18n_1.default.__('user.profile_data_missing'));
                    err.statusCode = 400;
                    throw err;
                }
                return userMessage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get company profile
    * 🗓 Created : 03/10/2024
    */
    getDetailsForCompanyMessage(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [companyMessage] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE}`)
                    .where('company_uuid', uuid);
                if (!companyMessage) {
                    const err = new Error(i18n_1.default.__('company.profile_data_missing'));
                    err.statusCode = 400;
                    throw err;
                }
                return companyMessage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Sushant Shekhar
    * 🚩 @uses : get thread id
    * 🗓 Created : 21/10/2024
    */
    getThreadByFields(productionUuid, fieldId, companyUuid, loggedInUser, sequenceUuid, exportUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twentyFourHoursAgo = moment_1.default.utc().subtract(24, 'hours').toISOString();
                let queryData = (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .select('thread_id')
                    .where('field_id', fieldId)
                    .andWhere('production_uuid', productionUuid)
                    .andWhere('company_uuid', companyUuid)
                    .andWhere('user_uuid', loggedInUser)
                    .andWhere('sequence_uuid', sequenceUuid)
                    .andWhere('export_uuid', exportUuid);
                //
                // This change by Raj
                // As condition should be if company uuid is there than thread must be for that user specific too
                //
                // if(companyUuid){
                //     data.andWhere('company_uuid',companyUuid)
                // }
                // else{
                //     data.andWhere('user_uuid',loggedInUser)
                // }
                if (fieldId == 'vf_ai_btn_help') {
                    queryData.andWhere(database_1.default.raw('created_at::date = ?', [moment_1.default.utc().format('YYYY-MM-DD')]));
                }
                else {
                    queryData.andWhere('created_at', '>=', twentyFourHoursAgo);
                }
                // if(companyUuid){
                //     queryData.andWhere('company_uuid',companyUuid);
                // }
                // if(loggedInUser) {
                //     queryData.andWhere('user_uuid',loggedInUser);
                // }
                console.log(queryData.toString());
                const [data] = yield queryData;
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : get production details
    * 🗓 Created : 03/10/2024
    */
    validateFiledId(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [fileId] = yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .select('field_id')
                    .where('field_id', uuid);
                // if(!fileId){
                //     const err:any = new Error(i18n.__('ai_assistant.filed_id_not_exist'));
                //     err.statusCode = 400;
                //     throw err;
                // }
                return fileId;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
   * 😎 @author : sushant shekhar
   * 🚩 @uses : update production uuid by thread id and field id
   * 🗓 Created : 22/10/2024
   */
    updateProductionUuidByThreadId(updateAiAssistantModel, threadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.AI_ASSISTANT}.${constant_1.default.tables.USER_THREAD}`)
                    .update(updateAiAssistantModel)
                    .whereIn('thread_id', threadIds);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new aiAssistantRepos();
//# sourceMappingURL=aiAssistant.repos.js.map