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
// Import Models
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const aiAssistant_repos_1 = __importDefault(require("../../aiAssistant/repos/aiAssistant.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create production sequence service
🗓 @created : 13/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createSequence = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check production exists or not 
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        //  get sequence by production uuid
        //
        const sequence = yield production_repo_1.default.getSequenceByProductionUuid(params.production_uuid);
        if (body.name) {
            //
            //  check for duplicate title
            //
            const checkDuplicate = sequence.find((item) => item.title.toLowerCase() === `${body.name.toLowerCase()}`);
            if (checkDuplicate) {
                const err = new Error(i18n_1.default.__('production.sequence_title_exists'));
                err.statusCode = 400;
                throw err;
            }
            else {
                //
                //  prepare data model to add sequence 
                //
                const sequenceDataModel = {
                    title: body.name,
                    production_uuid: params.production_uuid,
                    target_audience: body.target_audience,
                    dead_line: body.dead_line,
                    script: body.script,
                    project_planning: body.project_planning,
                    status: constant_1.default.sequence_status.PRE_PRODUCTION,
                    aspect_ratio: body.aspect_ratio,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: logged_in_user.uuid
                };
                //
                //  save sequence
                //
                container.derived.sequenceData = yield production_repo_1.default.saveSequence(sequenceDataModel);
                container.output.result = {
                    uuid: container.derived.sequenceData.uuid,
                    title: container.derived.sequenceData.title
                };
            }
        }
        else {
            const nameSequence = (i18n_1.default.__('production.sequence_prefix'));
            const splitSequence = nameSequence.split(" ");
            //
            //  prepare data model to add sequence 
            //
            const sequenceDataModel = {
                title: (splitSequence[0] + " " + parseInt(`${sequence.length + 1}`)).toLowerCase(),
                production_uuid: params.production_uuid,
                target_audience: body.target_audience,
                dead_line: body.dead_line,
                script: body.script,
                project_planning: body.project_planning,
                status: constant_1.default.sequence_status.PRE_PRODUCTION,
                aspect_ratio: body.aspect_ratio,
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                created_by: logged_in_user.uuid
            };
            //
            //  save sequence
            //
            container.derived.sequenceData = yield production_repo_1.default.saveSequence(sequenceDataModel);
            container.output.result = {
                uuid: container.derived.sequenceData.uuid,
                title: container.derived.sequenceData.title
            };
        }
        //
        //  update sequence uuid in ai assistant 
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
                sequence_uuid: container.derived.sequenceData.uuid
            };
            //
            // to update all the threads for same production
            //
            yield aiAssistant_repos_1.default.updateProductionUuidByThreadId(updateAiAssistantModel, threadIds);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = createSequence;
//# sourceMappingURL=createSequence.service.js.map