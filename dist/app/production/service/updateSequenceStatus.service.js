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
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update production sequence status service
🗓 @created : 05/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateSequenceStatusService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check production exists or not 
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //  
        //  update sequence data
        //  
        yield updateSequenceData(container);
        //
        //  store message into container
        //
        container.output.message = i18n_1.default.__('production.sequence_status_update');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update sequence data
🗓 @created : 13/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateSequenceData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  check sequence exists or not
        //
        const sequence = yield production_repo_1.default.checkSequence(body.sequence_uuid);
        if (!sequence) {
            const err = new Error(i18n_1.default.__('production.sequence_not_exists'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  prepare data model to update sequence status data
        //
        const updateSequenceDataModel = {
            status: body.status,
            updated_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            updated_by: logged_in_user.uuid
        };
        //
        //  update sequence data
        //
        yield production_repo_1.default.updateSequence(body.sequence_uuid, updateSequenceDataModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateSequenceStatusService;
//# sourceMappingURL=updateSequenceStatus.service.js.map