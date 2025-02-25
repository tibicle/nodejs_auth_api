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
const user_repo_1 = __importDefault(require("../repos/user.repo"));
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : sent invite to members list API service
* 🗓 Created : 07/11/2024
*/
const sentInvitationListService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { params, logged_in_user, query, body }, } = container;
        //
        //  get all sent invited users list send by company
        //
        yield sentInvitationMembers(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
* 😎 @author : Sushant Shekhar
* 🚩 @uses : get all sent invite members by company uuid
* 🗓 Created : 21/11/2023
*/
const sentInvitationMembers = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield user_repo_1.default.getAllSentInvitationMembersList(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get all invited members data
            //
            container.output.result = yield user_repo_1.default.getAllSentInvitationMembersList(container, 'invitedMembersData');
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = sentInvitationListService;
//# sourceMappingURL=sentInvitationList.service.js.map