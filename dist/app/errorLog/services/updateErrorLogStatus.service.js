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
// Import Static
// Import Middleware
// Import Helpers
// Import validations
// Import Interface 
// Import Libraries
// Import Repos
const errorLog_repo_1 = __importDefault(require("../repos/errorLog.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update error log status and add comments service
🗓 @created : 18/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateErrorLog = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params }, derived: {} } = container;
        //
        //  check log exists or not
        //
        yield errorLog_repo_1.default.checkLogByUuid(params.uuid);
        //
        //  update the log status and comment
        //
        yield updateStatus(container);
        container.output.message = i18n_1.default.__('error_log.status_update');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update status and comment
🗓 @created : 18/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateStatus = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, } } = container;
        //
        //  Prepare the model to update status & comments
        //
        const updateStatusDataModel = {
            status: body.status,
            comment: body.comment,
            updated_by: logged_in_user.uuid,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
        };
        //
        //  update the log status and comment
        //
        yield errorLog_repo_1.default.updateLogDetails(params.uuid, updateStatusDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateErrorLog;
//# sourceMappingURL=updateErrorLogStatus.service.js.map