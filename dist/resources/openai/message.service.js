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
const constant_1 = __importDefault(require("../../config/constant"));
const ai_1 = __importDefault(require("../../config/ai"));
class threadService {
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses :  create message
    * 🗓 Created : 02/10/2024
    */
    createMessage(threadId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let threadMessages = yield ai_1.default.beta.threads.messages.create(`${threadId}`, { role: "user", content: `${message}` });
                const response = yield ai_1.default.beta.threads.runs.create(threadId, {
                    assistant_id: constant_1.default.app.AI_ASSISTANT.ASSISTANT_ID
                });
                function checkStatus(threadId, runId) {
                    return __awaiter(this, void 0, void 0, function* () {
                        //
                        // Retrieve the current status of the run
                        //
                        const runObject = yield ai_1.default.beta.threads.runs.retrieve(response.thread_id, response.id);
                        const status = runObject.status;
                        //
                        // Check the status and act accordingly
                        //
                        if (status === 'completed') {
                            const threadMessages = yield ai_1.default.beta.threads.messages.list(threadId);
                            return threadMessages.data[0].content;
                        }
                        else if (status === 'queued' || status === 'in_progress') {
                            //
                            // Call the function recursively until the status is completed
                            //
                            return checkStatus(threadId, runId);
                        }
                    });
                }
                //
                // Start checking the status
                //
                const finalRunObject = yield checkStatus(response.thread_id, response.id);
                return finalRunObject;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new threadService();
//# sourceMappingURL=message.service.js.map