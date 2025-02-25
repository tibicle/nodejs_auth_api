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
const team_repo_1 = __importDefault(require("../repos/team.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : list all team members of particular team API services
🗓 @created : 29/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTeamDetailService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        container.derived.tagData = [];
        //
        //  valdate team uuid exist or not
        //
        yield team_repo_1.default.getTeamByUuid(params.uuid);
        //
        //  get team deatils by team uuid
        //
        container.derived.team = yield team_repo_1.default.getTeamDetails(params.uuid);
        //
        // get tag name by using tag_uuid
        //
        yield getTagName(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get tag name by tag uuid
🗓 @created : 29/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTagName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { team } } = container;
        if (team.tag_uuid != null) {
            for (let i = 0; i < team.tag_uuid.length; i++) {
                //
                // store the tag name with uuid
                //
                const tagDetail = yield team_repo_1.default.getTagNameByUuid(team.tag_uuid[i]);
                container.derived.tagData.push(tagDetail);
            }
        }
        team.tag = container.derived.tagData;
        container.output.result = team;
        delete (container.output.result.tag_uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getTeamDetailService;
//# sourceMappingURL=getTeamDetail.service.js.map