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
// Import Libraries
// Import services
//  Import Repo
const team_repo_1 = __importDefault(require("../../team/repos/team.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get dashboard team list service
🗓 @created : 02/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getDashboardTeamListService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield team_repo_1.default.getDashboardTeamList(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the team List
            //
            const data = yield team_repo_1.default.getDashboardTeamList(container, 'dashboardTeamList');
            if (data && data.length > 0) {
                for (const resultData of data) {
                    resultData.storage_used = '6 GB';
                }
            }
            container.output.result = data;
        }
        else {
            container.output.result = [];
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getDashboardTeamListService;
//# sourceMappingURL=getDashboardTeamList.js.map