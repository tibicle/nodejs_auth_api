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
const constant_1 = __importDefault(require("../../../config/constant"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get sequence status
🗓 @created : 16/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getSequenceStatusService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        // get sequence status 
        //
        let sequenceStatus = constant_1.default.sequence_status;
        let sequenceArray = [];
        for (let sequence in sequenceStatus) {
            sequenceArray.push(sequence);
        }
        container.output.result = sequenceArray;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getSequenceStatusService;
//# sourceMappingURL=getSequencestatus.service.js.map