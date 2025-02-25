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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Libraries
// Import services
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : delete production timeline sequence
🗓 @created : 13/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const deleteSequence = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params, body, query } } = container;
        //
        //  check production exists or not
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        const sequence = yield production_repo_1.default.checkSequence(query.sequence_uuid);
        if (!sequence) {
            const err = new Error(i18n_1.default.__('production.sequence_not_exists'));
            err.statusCode = 400;
            throw err;
        }
        if (sequence && (query.title === sequence.title)) {
            //
            //  delete timeline data of particular sequence
            //
            yield production_repo_1.default.deleteProductionTimelineSequence(query.sequence_uuid);
            //
            //  delete sequence
            //
            yield production_repo_1.default.deleteSequence(query.sequence_uuid);
            //
            //  add success message
            //
            container.output.message = i18n_1.default.__('production.sequence_delete_success');
        }
        else {
            const err = new Error(i18n_1.default.__('production.title_not_match'));
            err.statusCode = 400;
            throw err;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = deleteSequence;
//# sourceMappingURL=deleteSequence.service.js.map