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
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
class TeamRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : validate the name is already present or not
    🗓 @created : 20/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateTeamName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [nameData] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`)
                    .whereRaw("LOWER(TRIM(t.name)) = ?", [name.trim().toLowerCase()]);
                return nameData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check tag
    🗓 @created : 20/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tagData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG}`)
                    .where('name', tag.toLowerCase());
                return tagData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert new tag
    🗓 @created : 20/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveNewTag(tagModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG}`)
                    .insert(tagModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert data in team database
    🗓 @created : 20/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTeamDetail(teamModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [storeData] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .insert(teamModel)
                    .returning('uuid');
                return storeData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert invite members in user_invitation table
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveInviteMembers(inviteMembersModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .insert(inviteMembersModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : get team details by uuid
  🗓 @created : 21/11/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
    getTeamByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [teamData] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .where('uuid', uuid);
                if (!teamData) {
                    const err = new Error(i18n_1.default.__('team.no_team_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return teamData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get team details by uuid
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteTeamByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .del()
                    .where('uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete all invited members for particular team
    🗓 @created : 22/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteInvitedMembers(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .del()
                    .where('team_uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : delete all team members from particular
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteTeamMembers(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .del()
                    .where('team_uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     👑 @creator : Sushant shekhar
     🚩 @uses : return all data with total count
     🗓 @created : 26/10/2023
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    getAllteamList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let teamListQuery = (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`)
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tm`, 't.uuid', 'tm.team_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 't.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 't.company_uuid', 'c.uuid')
                    .where('tm.user_uuid', logged_in_user.uuid);
                if (str == 'CountTotalData') {
                    // Filter
                    yield this.searchFilter(container, teamListQuery);
                    teamListQuery
                        .count('* as total_results');
                    let [results] = yield teamListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'teamList') {
                    teamListQuery
                        .select('t.uuid', 't.name', 't.desc', 't.file_uuid', 'c.uuid as company_uuid', 'c.name as company_name')
                        .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tmm`, 't.uuid', 'tmm.team_uuid')
                        .select(database_1.default.raw('CAST(COUNT(tmm.uuid) AS INTEGER) as total_members'))
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/team_profile_image', f.name)) ELSE NULL END as file_url`))
                        .groupBy('c.name', 'f.name', 't.uuid', 'c.uuid');
                    // Filter
                    yield this.searchFilter(container, teamListQuery);
                    if (query.per_page &&
                        query.page) {
                        teamListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        teamListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield teamListQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     👑 @creator : Sushant Shekhar
     🚩 @uses : return filtered data if anyone search
     🗓 @created : 03/09/2024
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    searchFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.team_name) {
                    searchQuery.whereRaw(`(LOWER("t"."name") LIKE '%${query.team_name.toLowerCase()}%')`);
                }
                if (query.company_uuid) {
                    searchQuery.andWhere('c.uuid', query.company_uuid);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update team details
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTeamDetails(updateTeamModel, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .where('uuid', uuid)
                    .update(updateTeamModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     👑 @creator : Sushant shekhar
     🚩 @uses : get all team members of the team
     🗓 @created : 28/11/2023
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    getAllTeamMembers(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { params, query, logged_in_user } } = container;
                let teamMembersListQuery = (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tm`)
                    .where('tm.team_uuid', params.uuid);
                if (str == 'CountTotalData') {
                    this.teamMemberFilter(container, teamMembersListQuery);
                    teamMembersListQuery
                        .count('* as total_results');
                    let [results] = yield teamMembersListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'teamMemberList') {
                    teamMembersListQuery = database_1.default.with('RankedRoles', (qb) => {
                        qb.select('tm.uuid', 'u.first_name', 'u.last_name', 'u.file_uuid', 'u.email', 'tm.team_uuid', 'r.name as role')
                            .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END as file_url`))
                            .select(database_1.default.raw(`CASE WHEN tm.created_by = t.created_by THEN true ELSE false END as team_member_owner`))
                            .select(database_1.default.raw(`
                      ROW_NUMBER() OVER (
                          PARTITION BY tm.user_uuid
                          ORDER BY CASE WHEN r.name = 'Owner' THEN 1 ELSE 2 END
                      ) as rn
                  `))
                            .from(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tm`)
                            .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`, 't.uuid', 'tm.team_uuid')
                            .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.uuid', 'tm.user_uuid')
                            .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                            .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`, 'tm.user_uuid', 'ur.user_uuid')
                            .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as r`, 'r.uuid', 'ur.role_uuid')
                            .where('tm.team_uuid', params.uuid)
                            .groupBy('tm.uuid', 'u.first_name', 'u.last_name', 'u.file_uuid', 'u.email', 'f.name', 'r.name', 't.created_by');
                    }).select('*').from('RankedRoles').where('rn', 1);
                    this.teamMemberFilter(container, teamMembersListQuery);
                    if (query.per_page &&
                        query.page) {
                        teamMembersListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        teamMembersListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield teamMembersListQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : add filter in team members
      🗓 @created : 23/08/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    teamMemberFilter(container, teamMemberQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    teamMemberQuery.whereRaw(`LOWER(CONCAT_WS(' ',"first_name","last_name")) LIKE '%${query.name.toLowerCase()}%'`);
                }
                return teamMemberQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : check team member exist or not
  🗓 @created : 29/11/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
    validateTeamMember(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [teamMemberData] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where('uuid', uuid);
                if (!teamMemberData) {
                    const err = new Error(i18n_1.default.__('team.no_team_member_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return teamMemberData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     👑 @creator : Sushant Shekhar
     🚩 @uses : delete team member from team members table
     🗓 @created : 29/11/2023
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    deleteTeamMember(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .del()
                    .where('uuid', uuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : get team member by team uuid and user uuid
      🗓 @created : 29/11/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    getTeamMemberByTeamAndUser(teamUuid, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where('team_uuid', teamUuid)
                    .andWhere('user_uuid', userUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : get team details with tag and company name by team uuid
      🗓 @created : 29/11/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    getTeamDetails(teamUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 't.company_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 't.file_uuid')
                    .select('t.uuid', 't.name', 't.desc as bio', 't.tag_uuid', 'f.uuid as file_uuid', 'c.uuid as company_uuid', 'c.name as company_name', 't.created_by', 't.updated_by', 't.created_at', 't.updated_at')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/team_profile_image', f.name)) ELSE NULL END as file_url`))
                    .where('t.uuid', teamUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : get tag by uuid
      🗓 @created : 29/11/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    getTagNameByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [tagData] = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.TAG} as t`)
                    .where("t.uuid", uuid)
                    .select('t.uuid', 't.name');
                return tagData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : validate team uuid is valid or not in team members table
      🗓 @created : 30/11/2023
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    checkTeamByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [teamData] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where("team_uuid", uuid);
                if (!teamData) {
                    const err = new Error(i18n_1.default.__('team.no_team_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return teamData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      👑 @creator : Sushant Shekhar
      🚩 @uses : get team member in particular team
      🗓 @created : 29/08/2024
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    getTeamMemberByTeamUuid(teamUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where('team_uuid', teamUuid);
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get dashboard team list
    🗓 @created : 02/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getDashboardTeamList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let teamListQuery = (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`)
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tm`, 't.uuid', 'tm.team_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 't.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 't.company_uuid', 'c.uuid')
                    .where('tm.user_uuid', logged_in_user.uuid);
                if (query.company_uuid) {
                    teamListQuery.andWhere('t.company_uuid', query.company_uuid);
                }
                if (str === 'CountTotalData') {
                    teamListQuery.count('* as total_results');
                    let [results] = yield teamListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str === 'dashboardTeamList') {
                    teamListQuery
                        .select('t.uuid', 't.name', 't.desc', 't.file_uuid', 'c.name as company_name', 'c.uuid as company_uuid')
                        .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tmm`, 't.uuid', 'tmm.team_uuid')
                        .select(database_1.default.raw('CAST(COUNT(DISTINCT tmm.uuid) AS INTEGER) as total_members'))
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/team_profile_image', f.name)) ELSE NULL END as file_url`))
                        .groupBy('c.name', 'f.name', 't.uuid', 'c.uuid')
                        .select(database_1.default.raw(`
              (
                SELECT json_agg(json_build_object(
                  'uuid', u.uuid,
                  'first_name', u.first_name,
                  'last_name', u.last_name,
                  'profile_pic', fl.name
                ) ORDER BY u.first_name ASC)
                FROM ${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tmmm
                LEFT JOIN ${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u ON tmmm.user_uuid = u.uuid
                LEFT JOIN ${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fl ON u.file_uuid = fl.uuid
                WHERE tmmm.team_uuid = t.uuid
                LIMIT 5
              ) as team_members
            `));
                    if (query.per_page && query.page) {
                        teamListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        teamListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield teamListQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     👑 @creator : Sushant Shekhar
     🚩 @uses : validate team name for particular company
     🗓 @created : 12/09/2024
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    validateTeamNameForCompany(name, companyUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere("company_uuid", companyUuid);
                return validateName;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : validate team name for self
    🗓 @created : 12/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateTeamNameForSelf(name, userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [validateName] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                    .andWhere('company_uuid', null)
                    .andWhere("user_uuid", userUuid);
                return validateName;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : get all team by company uuid
  🗓 @created : 06/11/2024
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
    getAllTeamByCompanyUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM}`)
                    .pluck('uuid')
                    .where('company_uuid', uuid);
                return team;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all team by team uuid
    🗓 @created : 06/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllTeamMembersByTeamUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMembers = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where('team_uuid', uuid);
                return teamMembers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all team by team uuid
    🗓 @created : 06/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateTeamMemberInTeam(userUuid, totalTeam, teamUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMembers = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .where('user_uuid', userUuid)
                    .whereIn('team_uuid', totalTeam)
                    .andWhereNot('team_uuid', teamUuid);
                return teamMembers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all team member by team uuid
    🗓 @created : 06/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTeamMemberInCompanyTeam(totalTeam) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [teamMembers] = yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .count('uuid')
                    .whereIn('team_uuid', totalTeam);
                return teamMembers;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new TeamRepo();
//# sourceMappingURL=team.repo.js.map