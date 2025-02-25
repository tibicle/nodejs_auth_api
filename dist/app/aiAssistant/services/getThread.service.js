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
// import authRepos from "../repos/company.repos";
const i18n_1 = __importDefault(require("../../../config/i18n"));
const aiAssistant_repos_1 = __importDefault(require("../repos/aiAssistant.repos"));
const messageList_service_1 = __importDefault(require("../../../resources/openai/messageList.service"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : store thread
* 🗓 Created : 01/10/2024
*/
const getThreadService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, query, body, logged_in_user }, } = container;
        let isPagination = false;
        container.output.meta = {};
        //
        // Check if `page` and `per_page` are provided for pagination
        //
        if (query && ('page' in query && 'per_page' in query)) {
            const page = parseInt(query.page) || 1;
            const per_page = parseInt(query.per_page) || 10;
            container.output.meta.page = page;
            container.output.meta.per_page = per_page;
            isPagination = true;
        }
        if (query.thread_id) {
            //
            // Fetch the thread by threadId
            //
            var thread = yield aiAssistant_repos_1.default.getThreadByThreadId(query.thread_id);
            if (!thread) {
                const err = new Error(i18n_1.default.__('ai_assistant.thread_not_exist'));
                err.statusCode = 400;
                throw err;
            }
        }
        if (thread) {
            container.derived.thread_id = thread;
        }
        else {
            if (query.production_uuid) {
                //
                //  validate production uuid is present or not
                //
                container.derived.production_uuid = yield production_repo_1.default.getProductionByProductionUuid(query.production_uuid);
            }
            if (query.sequence_uuid) {
                //
                //  validate sequence uuid is present or not
                //
                container.derived.sequence_uuid = yield production_repo_1.default.getSequenceBySequenceUuid(query.sequence_uuid);
                if (!container.derived.sequence_uuid) {
                    const err = new Error(i18n_1.default.__('production.sequence_not_exists'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (query.export_uuid) {
                //
                //  validate export uuid is present or not
                //
                container.derived.export_uuid = yield export_repo_1.default.getExportDetailsByUuid(query.export_uuid);
                if (!container.derived.export_uuid) {
                    const err = new Error(i18n_1.default.__('export.no_export_file_exists'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            // if(query.field_id){
            //     //
            //     //  validate field id is present or not
            //     //
            //     container.derived.fieldId = await aiAssistantRepos.validateFiledId(query.field_id)
            // }
            if (query.company_uuid != null) {
                //
                //  validate company exist or not
                //
                container.derived.company = yield aiAssistant_repos_1.default.getCompanyByCompanyUuid(query.company_uuid);
            }
            if (query.production_uuid && query.field_id && query.company_uuid) {
                if (query.sequence_uuid) {
                    if (query.export_uuid) {
                        //
                        //  get thread by following data
                        //
                        container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, query.company_uuid, logged_in_user.uuid, query.sequence_uuid, query.export_uuid);
                    }
                    else {
                        //
                        //  get thread by following data
                        //
                        container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, query.company_uuid, logged_in_user.uuid, query.sequence_uuid, null);
                    }
                }
                else {
                    //
                    //  get thread by following data
                    //
                    container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, query.company_uuid, logged_in_user.uuid, null, null);
                }
            }
            else if (query.production_uuid && query.field_id && !query.company_uuid) {
                if (query.sequence_uuid) {
                    if (query.export_uuid) {
                        //
                        //  get thread by following data
                        //
                        container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, null, logged_in_user.uuid, query.sequence_uuid, query.export_uuid);
                    }
                    else {
                        //
                        //  get thread by following data
                        //
                        container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, null, logged_in_user.uuid, query.sequence_uuid, null);
                    }
                }
                else {
                    //
                    //  get thread by following data
                    //
                    container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(query.production_uuid, query.field_id, null, logged_in_user.uuid, null, null);
                }
            }
            else if (query.field_id == 'vf_ai_btn_help') {
                container.derived.thread_id = yield aiAssistant_repos_1.default.getThreadByFields(null, query.field_id, (query.company_uuid && query.company_uuid != null) ? query.company_uuid : null, logged_in_user.uuid, null);
            }
            else {
                return container.output.result = [];
            }
        }
        //
        // Fetch paginated messages if pagination parameters are provided
        //
        if (isPagination && container.derived.thread_id) {
            const offset = (container.output.meta.page - 1) * container.output.meta.per_page;
            const paginatedMessages = yield messageList_service_1.default.getmessageByPage(container.derived.thread_id.thread_id, offset, container.output.meta.per_page);
            //
            // modifying the response message
            //
            const response = paginatedMessages.messages;
            const responseArray = [];
            for (let data of response) {
                delete data.assistant_id,
                    delete data.run_id,
                    delete data.created_at,
                    delete data.object;
                responseArray.push(data);
            }
            //
            // response result
            //
            container.output.result = responseArray;
            container.output.meta.total_rows = paginatedMessages.total_rows;
        }
        else if (!isPagination && container.derived.thread_id) {
            //
            // No pagination provided, fetch all messages  
            //
            const response = yield messageList_service_1.default.getmessage(container.derived.thread_id.thread_id);
            //
            // modifying the response message
            //        
            const responseArray = [];
            for (let data of response) {
                delete data.assistant_id,
                    delete data.run_id,
                    delete data.created_at,
                    delete data.object;
                responseArray.push(data);
            }
            //
            // response result
            //
            container.output.result = responseArray;
        }
        else {
            return container.output.result = [];
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getThreadService;
//# sourceMappingURL=getThread.service.js.map