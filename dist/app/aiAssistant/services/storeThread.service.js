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
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Repos
const aiAssistant_repos_1 = __importDefault(require("../repos/aiAssistant.repos"));
// import companyRepos from "../repos/company.repos";
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const thread_service_1 = __importDefault(require("../../../resources/openai/thread.service"));
const message_service_1 = __importDefault(require("../../../resources/openai/message.service"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const export_repo_1 = __importDefault(require("../../export/repo/export.repo"));
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : store thread
* 🗓 Created : 01/10/2024
*/
const storeThreadService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        // Check if thread exists
        //
        yield checkThreadExist(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : check thread exist or not
* 🗓 Created : 01/10/2024
*/
const checkThreadExist = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        var threadFlag = false;
        if (body.thread_id) {
            container.derived.thread = yield aiAssistant_repos_1.default.getThreadByThreadId(body.thread_id);
            if (!container.derived.thread) {
                threadFlag = false;
            }
            else {
                threadFlag = true;
            }
        }
        if (body.thread_id && threadFlag == true) {
            container.derived.thread = yield aiAssistant_repos_1.default.getThreadByThreadId(body.thread_id);
            //
            // Handle existing thread
            //
            yield handleExistingThreadByThreadId(container);
        }
        else {
            if (body.company_uuid) {
                //
                // Check company exists
                //
                container.derived.company = yield company_repos_1.default.getCompanyByCompanyUuid(body.company_uuid);
                //
                // Check for existing company thread
                //
                // container.derived.companyThread = await aiAssistantRepos.getThreadByCompanyUuid(container.derived.company.uuid,body.field_id,logged_in_user.uuid);
            }
            if (body.production_uuid) {
                //
                // Check if production exists
                //
                container.derived.production = yield production_repo_1.default.getProductionByProductionUuid(body.production_uuid);
            }
            if (body.sequence_uuid) {
                //
                //  get sequence details
                //
                container.derived.sequence = yield production_repo_1.default.getSequenceBySequenceUuid(body.sequence_uuid);
            }
            if (body.export_uuid) {
                //
                //  get export details
                //
                container.derived.exportDetails = yield export_repo_1.default.getExportDetailsByUuid(body.export_uuid);
            }
            if (body.company_uuid) {
                //
                // Handle new company thread
                //
                yield handleCompanyThreadCreation(container);
            }
            else if (body.company_uuid === null) {
                //
                // Handle new user thread
                //
                yield handleUserThreadCreation(container);
            }
            else {
                const err = new Error("thread issue");
                err.statusCode = 400;
                throw err;
            }
        }
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : Function to handle creating a company thread
* 🗓 Created : 4/10/2024
*/
const handleCompanyThreadCreation = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { production, company, sequence, exportDetails } } = container;
        //
        // Get company details
        //
        const companyDetails = yield company_repos_1.default.getDetailsForCompanyMessage(company.uuid);
        //
        // Create manual message
        //
        const companyMessage = `${i18n_1.default.__('company_message.company_name', { company_name: company.name })} ${i18n_1.default.__('company_message.company_profile_bio', { company_name: company.name, company_profile_bio: companyDetails.company_profile_bio })} ${i18n_1.default.__('company_message.reply_message', { name: logged_in_user.first_name })} `;
        const productionMessage = ` ${i18n_1.default.__('company_message.production_intro', { production_name: production ? production.name : body.production_name, })} ${i18n_1.default.__('company_message.production_description', { production_description: production ? production.description : body.production_description })}`;
        const bodyMessage = `${i18n_1.default.__('company_message.body_message', { message: body.message })}`;
        if (body.sequence_uuid || body.sequence_name) {
            var sequenceMessage = ` ${i18n_1.default.__('company_message.sequence_intro', { sequence_name: sequence ? sequence.title : body.sequence_name, })}`;
        }
        //
        // Create thread 
        //
        container.derived.thread_id = yield thread_service_1.default.createThread();
        yield message_service_1.default.createMessage(container.derived.thread_id.id, companyMessage);
        yield message_service_1.default.createMessage(container.derived.thread_id.id, productionMessage);
        if (body.sequence_uuid || body.sequence_name) {
            yield message_service_1.default.createMessage(container.derived.thread_id.id, sequenceMessage);
        }
        var message = yield message_service_1.default.createMessage(container.derived.thread_id.id, bodyMessage);
        //
        // store the thread with company details in db 
        //
        const threadModel = {
            user_uuid: logged_in_user.uuid,
            field_id: body.field_id,
            thread_id: container.derived.thread_id.id,
            company_uuid: company.uuid,
            production_uuid: production ? production.uuid : null,
            sequence_uuid: sequence ? sequence.uuid : null,
            export_uuid: exportDetails ? exportDetails.uuid : null,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        // set response in result
        //
        const [data] = yield aiAssistant_repos_1.default.storeThread(threadModel);
        data.message = message;
        container.output.result = data;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : Function to handle creating a user thread
* 🗓 Created : 4/10/2024
*/
const handleUserThreadCreation = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { production, sequence, exportDetails } } = container;
        //
        // Get user details
        //
        const userDetails = yield user_repo_1.default.getDetailsForUserMessage(logged_in_user.uuid);
        if (!userDetails) {
            var userMessage = `${i18n_1.default.__('user_message.introduction', { first_name: logged_in_user.first_name, last_name: logged_in_user.last_name })} ${i18n_1.default.__('user_message.production_levels')} ${i18n_1.default.__('company_message.reply_message', { name: logged_in_user.first_name })}`;
        }
        else {
            userMessage = `${i18n_1.default.__('user_message.introduction', { first_name: logged_in_user.first_name, last_name: logged_in_user.last_name })} ${i18n_1.default.__('user_message.usage', { help: userDetails.help })} ${i18n_1.default.__('user_message.production_levels')} ${i18n_1.default.__('user_message.experience', { pre_production: userDetails.pre_production, production: userDetails.production, post_production: userDetails.post_production })} ${i18n_1.default.__('company_message.reply_message', { name: logged_in_user.first_name })}`;
        }
        //
        // Bind user message with body message
        //
        const productionMessage = ` ${i18n_1.default.__('company_message.production_intro', { production_name: production ? production.name : body.production_name, })}${i18n_1.default.__('company_message.production_description', { production_description: production ? production.description : body.production_description, })}`;
        const bodyMessage = `${i18n_1.default.__('company_message.body_message', { message: body.message })}`;
        if ((body.sequence_uuid || body.sequence_name) && !body.export_uuid) {
            var sequenceMessage = ` ${i18n_1.default.__('company_message.sequence_intro', { sequence_name: sequence ? sequence.title : body.sequence_name, })}`;
        }
        //
        // Create thread 
        //
        container.derived.thread_id = yield thread_service_1.default.createThread();
        yield message_service_1.default.createMessage(container.derived.thread_id.id, userMessage);
        yield message_service_1.default.createMessage(container.derived.thread_id.id, productionMessage);
        if ((body.sequence_uuid || body.sequence_name) && !body.export_uuid) {
            yield message_service_1.default.createMessage(container.derived.thread_id.id, sequenceMessage);
        }
        var message = yield message_service_1.default.createMessage(container.derived.thread_id.id, bodyMessage);
        //
        // store the user data in db
        //
        const threadModel = {
            user_uuid: logged_in_user.uuid,
            field_id: body.field_id,
            thread_id: container.derived.thread_id.id,
            production_uuid: production ? production.uuid : null,
            sequence_uuid: sequence ? sequence.uuid : null,
            export_uuid: exportDetails ? exportDetails.uuid : null,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        const [data] = yield aiAssistant_repos_1.default.storeThread(threadModel);
        data.message = message;
        container.output.result = data;
    }
    catch (err) {
        throw err;
    }
});
/*
* 😎 @author : Ekta Patel
* 🚩 @uses : Function to handle existing thread
* 🗓 Created : 4/10/2024
*/
const handleExistingThread = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { production, thread, companyThread, company } } = container;
        if (thread) {
            if (body.message) {
                var message = yield message_service_1.default.createMessage(thread.thread_id, body.message);
                container.output.result = yield aiAssistant_repos_1.default.getThreadByUserUuid(logged_in_user.uuid, body.field_id);
                container.output.result.message = message;
            }
        }
        else if (companyThread && body.message) {
            var message = yield message_service_1.default.createMessage(companyThread.thread_id, body.message);
            container.output.result = yield aiAssistant_repos_1.default.getThreadByCompanyUuid(company.uuid, body.field_id, logged_in_user.uuid);
            container.output.result.message = message;
        }
        else {
            const err = new Error(i18n_1.default.__("ai_assistant.message_not_defined"));
            err.statusCode = 400;
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : Function to handle existing thread
* 🗓 Created : 21/10/2024
*/
const handleExistingThreadByThreadId = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { thread } } = container;
        var message = yield message_service_1.default.createMessage(thread.thread_id, body.message);
        container.output.result = yield aiAssistant_repos_1.default.getThreadByThreadId(thread.thread_id);
        container.output.result.message = message;
    }
    catch (err) {
        throw err;
    }
});
exports.default = storeThreadService;
//# sourceMappingURL=storeThread.service.js.map