"use strict";
// Import Config
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
// Import Libraries
// Import services
//  Import Repo
const subscription_repo_1 = __importDefault(require("../repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get subscription by uuid
🗓 @created : 21/05/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const subcriptionByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params } } = container;
        // 
        //  get subscription by uuid and store the result
        // 
        container.output.result = yield subscription_repo_1.default.getSubscriptionByUuid(params.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = subcriptionByUuid;
//# sourceMappingURL=getSubscriptionByUuid.service.js.map