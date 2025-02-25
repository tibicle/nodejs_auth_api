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
const ai_1 = __importDefault(require("../../config/ai"));
class messageListService {
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : message list service with pagination
    * 🗓 Created : 07/10/2024
    */
    getmessageByPage(threadId, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                // Fetch all messages for the thread
                //
                const threadMessages = yield ai_1.default.beta.threads.messages.list(threadId);
                //
                // remove the 4 custom message from the list
                //
                const trimmedMessages = threadMessages.data.slice(0, -4);
                //
                // Calculate paginated messages
                //
                const paginatedMessages = trimmedMessages.slice(offset, offset + limit);
                return {
                    messages: paginatedMessages,
                    total_rows: threadMessages.data.length - 4
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
    * 😎 @author : Ekta Patel
    * 🚩 @uses : message list
    * 🗓 Created : 07/10/2024
    */
    getmessage(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const threadMessages = yield ai_1.default.beta.threads.messages.list(threadId);
                //
                // remove the 4 custom message from the list
                //
                const trimmedMessages = threadMessages.data.slice(0, -4);
                return trimmedMessages;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new messageListService();
//# sourceMappingURL=messageList.service.js.map