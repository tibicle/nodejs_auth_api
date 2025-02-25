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
// import companyRepos from "../repos/company.repos";
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const thread_service_1 = __importDefault(require("../../../resources/openai/thread.service"));
const message_service_1 = __importDefault(require("../../../resources/openai/message.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : kiosk service
🗓 @created : 18/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const kioskApiService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user } } = container;
        //
        //  handle kiosk feature
        //
        yield handleKioskUser(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : handle kiosk user
🗓 @created : 18/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const handleKioskUser = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user }, derived: { production } } = container;
        if (body.thread_id) {
            var resultMessage = yield message_service_1.default.createMessage(body.thread_id, body.message);
        }
        else {
            container.derived.thread_id = yield thread_service_1.default.createThread();
            var resultMessage = yield message_service_1.default.createMessage(container.derived.thread_id.id, body.message);
        }
        container.output.result = {
            thread_id: body.thread_id ? body.thread_id : container.derived.thread_id.id,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            message: resultMessage
        };
    }
    catch (err) {
        throw err;
    }
});
exports.default = kioskApiService;
//# sourceMappingURL=kioskApi.serivce.js.map