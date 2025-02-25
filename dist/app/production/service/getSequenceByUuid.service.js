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
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get production by uuid service
🗓 @created : 1/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getSequenceByUuidService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        // check production data
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        //  check sequence exists or not
        //
        const sequence = yield production_repo_1.default.checkSequence(params.sequence_uuid);
        container.output.result = sequence;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getSequenceByUuidService;
//# sourceMappingURL=getSequenceByUuid.service.js.map