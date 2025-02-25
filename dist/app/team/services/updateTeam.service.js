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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const team_repo_1 = __importDefault(require("../repos/team.repo"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create team service
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateTeamService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        //
        //  validate team which already exist or not
        //
        yield team_repo_1.default.getTeamByUuid(params.uuid);
        //
        //  validte name of the team already exist or not 
        //
        yield checkName(container);
        //
        //  check tag is present or not
        //
        yield checkTag(container);
        //
        //  check team image exists or not
        //
        if (body.file_uuid && body.file_uuid != null) {
            yield file_repo_1.default.checkFile(body.file_uuid);
        }
        //
        //  update Team details
        //
        yield updateTeamData(container);
        //
        //  update file data
        //
        yield updateFileDetails(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check name is already present or not
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  check team name already exist or not
        //
        const teamName = yield team_repo_1.default.validateTeamName(body.name);
        const getTeamDetails = yield team_repo_1.default.getTeamByUuid(params.uuid);
        if (getTeamDetails.created_by != logged_in_user.uuid) {
            //
            //  creator of team can only update the team
            //
            const err = new Error(i18n_1.default.__("team.cannot_update_team"));
            err.statusCode = 400;
            throw err;
        }
        if (teamName) {
            if (teamName.uuid != params.uuid) {
                //
                //  if same team name found then throw error
                //
                const err = new Error(i18n_1.default.__("team.name_already_exist"));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check tag is already present or not
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        container.derived.tag_uuid = [];
        if (body.tag || body.tag != null) {
            for (let i = 0; i < body.tag.length; i++) {
                //
                //  check tag is present or not
                //
                container.derived.tag = yield team_repo_1.default.validateTag(body.tag[i]);
                if (container.derived.tag) {
                    container.derived.tag_uuid.push(container.derived.tag.uuid);
                }
                if (!container.derived.tag || container.derived.tag == undefined) {
                    //
                    //  if tag not found insert new tag
                    //
                    container.derived.tagname = body.tag[i];
                    yield storeTag(container);
                }
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : story new tag in tag database
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create tag model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            type: constant_1.default.tag_type.TEAM,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new tag in tag database
        //
        yield team_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in tag_uuid array
        //
        const getTagUuid = yield team_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.tag_uuid.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : store data in production database
🗓 @created : 20/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateTeamData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        // update team model
        //
        const updateTeamModel = {
            name: body.name,
            desc: body.about,
            tag_uuid: container.derived.tag_uuid,
            file_uuid: body.file_uuid,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_by: logged_in_user.uuid
        };
        //
        //  update team model
        //
        yield team_repo_1.default.updateTeamDetails(updateTeamModel, params.uuid);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('team.team_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : update file details
🗓 @created : 11/06/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateFileDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params }, derived: { tag_uuid, teamUuid } } = container;
        if (body.file_uuid) {
            //
            //  prepare data model to uplaod file data
            //
            const updateFileDataModel = {
                ref_type: 'TEAM',
                ref_uuid: params.uuid,
                updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
            };
            yield file_repo_1.default.updateFiledata(body.file_uuid, updateFileDataModel);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateTeamService;
//# sourceMappingURL=updateTeam.service.js.map