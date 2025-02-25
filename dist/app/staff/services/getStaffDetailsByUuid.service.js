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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const staff_repo_1 = __importDefault(require("../repos/staff.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get staff details by uuid service
🗓 @created : 23/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getStaffDetailsByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check staff exists or not
        //
        yield user_repo_1.default.getUserByUuid(params.uuid);
        //
        //  get staff details
        //
        container.output.result = yield staff_repo_1.default.getStaffDetailsByUuid(params.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getStaffDetailsByUuid;
//# sourceMappingURL=getStaffDetailsByUuid.service.js.map