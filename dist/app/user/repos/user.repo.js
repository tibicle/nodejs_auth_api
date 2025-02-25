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
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const http_status_codes_1 = require("http-status-codes");
class UserRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get the user by email
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .whereRaw('LOWER(email) = LOWER(?)', [email]);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get user by uuid
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .select('uuid', 'first_name', 'last_name', 'email', 'gender', 'language', 'status')
                    .where('uuid', uuid);
                if (!user) {
                    const err = new Error(i18n_1.default.__('no_user_found'));
                    err.statusCode = 400;
                    throw err;
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user company uuid
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getCompanyByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [company] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY}`)
                    .where('user_uuid', userUuid);
                return company;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save library
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveLibrary(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const library = yield (0, database_1.default)(`${constant_1.default.schema.VIDEO_EDITOR}.${constant_1.default.tables.LIBRARY}`)
                    .insert(dataModel)
                    .returning('*');
                return library;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    * 😎 @author : Sushant Shekhar
    * 🚩 @uses : to get User
    * 🗓 Created : 19/10/2023
    */
    getUserFullProfile(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                // build the Query for company details
                //
                const companyDetailsQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as r`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, "r.uuid", "uc.company_uuid")
                    .select(database_1.default.raw(`coalesce(json_agg(json_build_object(
                        'uuid',"r"."uuid",
                        'name',"r"."name",
                        'email',"r"."email",
                        'address',"r"."address",
                        'vat_id',"r"."gstin",
                        'status',"r"."status",
                        'created_at',"r"."created_at",
                        'updated_at',"r"."updated_at"
                    )), '[]') as company_details`))
                    .where('uc.user_uuid', uuid)
                    .as('company_details');
                // const userRoleQuery = knex(`${config.schema.USERS}.${config.tables.ROLE} as r`)
                //     .leftJoin(`${config.schema.USERS}.${config.tables.USER_ROLE} as ur`,"r.uuid", "ur.role_uuid")
                //     .select(knex.raw(` json_agg(json_build_object('code',"r"."code",'name',"r"."name"))`))
                //     .where('ur.user_uuid',"=",knex.ref('u.uuid'))
                //     .as('user_role');
                //
                //build the user query
                //
                const userQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as fi`, "fi.uuid", "u.file_uuid")
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE} as up`, "up.user_uuid", "u.uuid")
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_ROLE} as ur`, "u.uuid", "ur.user_uuid")
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.ROLE} as c`, "ur.role_uuid", "c.uuid")
                    .select([
                    'u.uuid',
                    'u.first_name',
                    'u.last_name',
                    'u.email',
                    'u.date_of_birth',
                    'u.is_reset_on',
                    'u.gender',
                    'u.mobile_no',
                    'u.bio',
                    'c.name as role',
                    'u.status',
                    'u.created_at',
                    'u.updated_at',
                    'u.language',
                    'up.user_profile_bio',
                    'up.interest', 'up.help',
                    'up.experience_level',
                    'up.pre_production',
                    'up.production',
                    'up.post_production',
                    'is_email_verified',
                    'up.created_at as profile_created_at',
                    'up.updated_at as profile_updated_at'
                ])
                    .select(database_1.default.raw(`CASE WHEN fi.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', fi.name)) ELSE NULL END as file_url`))
                    .select(companyDetailsQuery)
                    // .select(userRoleQuery)
                    .where('u.uuid', uuid);
                const [userDetails] = yield userQuery;
                if (!userDetails) {
                    const err = new Error(i18n_1.default.__('invalid_user_uuid'));
                    err.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
                    throw err;
                }
                return userDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check mobile number already exist or not
    🗓 @created : 15/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkUserMobile(mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [mobileData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('mobile_no', mobileNumber);
                return mobileData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update user profile
    🗓 @created : 15/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateUserProfile(uuid, userModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .where('uuid', uuid)
                    .update(userModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get all members of the same company
    🗓 @created : 21/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllMembers(uuid, loggedInUserUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allmembers = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .join(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, "u.uuid", "uc.user_uuid")
                    .select([
                    'u.uuid',
                    'u.first_name',
                    'u.last_name',
                    'u.email',
                    'u.status',
                    'u.file_uuid',
                    'u.created_at',
                    'u.updated_at',
                ])
                    .where('uc.company_uuid', uuid)
                    .whereNot('u.uuid', loggedInUserUuid);
                return allmembers;
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
    getAllmembersList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, params, logged_in_user } } = container;
                let membersListQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'u.uuid', 'uc.user_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'uc.company_uuid')
                    .where('c.uuid', params.company_uuid)
                    .whereNot('u.uuid', logged_in_user.uuid);
                if (str == 'CountTotalData') {
                    membersListQuery
                        .count('* as total_results');
                    let [results] = yield membersListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'membersData') {
                    membersListQuery
                        .select('u.uuid', 'u.first_name', 'u.last_name', 'u.file_uuid', 'u.email', 'c.name as company_name', 'u.status', 'uc.created_at', 'u.mobile_no')
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                        .groupBy('c.name', 'f.name', 'u.uuid', 'uc.created_at');
                    if (query.per_page &&
                        query.page) {
                        membersListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        membersListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield membersListQuery;
                }
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
    getAllInvitedMembersList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, params, logged_in_user } } = container;
                let invitedMembersListQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION} as ui`, 'u.email', 'ui.email')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uu`, 'ui.created_by', 'uu.uuid')
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`, 'ui.team_uuid', 't.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 't.company_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 't.file_uuid')
                    .where('ui.email', logged_in_user.email)
                    .whereIn('ui.status', [constant_1.default.user_invitation.PENDING]);
                if (str == 'CountTotalData') {
                    //
                    // filter
                    //
                    yield this.teamInviteMemberFilter(container, invitedMembersListQuery);
                    invitedMembersListQuery
                        .count('* as total_results');
                    let [results] = yield invitedMembersListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'invitedMembersData') {
                    invitedMembersListQuery
                        .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS} as tmm`, 't.uuid', 'tmm.team_uuid')
                        .select(database_1.default.raw('CAST(COUNT(DISTINCT tmm.uuid) AS INTEGER) as total_members'))
                        .select('ui.uuid', 'u.first_name', 'u.last_name', 'uu.first_name as sender_fristname', 'uu.last_name as sender_lastname', 'ui.status', 'u.file_uuid', 'u.email', 'u.bio', 'ui.created_at', 't.name as team_name', 'ui.team_uuid', 'c.uuid as company_uuid', 'c.name as company_name')
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/team_profile_image', f.name)) ELSE NULL END as file_url`))
                        .groupBy('ui.uuid', 'u.uuid', 'f.name', 't.name', 'uu.first_name', 'uu.last_name', 'c.uuid');
                    //
                    // filter
                    //
                    yield this.teamInviteMemberFilter(container, invitedMembersListQuery);
                    if (query.per_page &&
                        query.page) {
                        invitedMembersListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        invitedMembersListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield invitedMembersListQuery;
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
    🚩 @uses : validate invited member exist or not
    🗓 @created : 24/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    validateInvitedMember(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [invitedMember] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .where('uuid', uuid);
                return invitedMember;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : update status of invited member either accepted or declined
    🗓 @created : 24/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateInvitedMemeberStatus(uuid, updateStatusModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .where('uuid', uuid)
                    .update(updateStatusModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : save accepted member in team members table
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTeamMembers(teamMemberModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM_MEMBERS}`)
                    .insert(teamMemberModel);
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
    🗓 @created : 28/11/2023
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
   🚩 @uses : check same email and team uuid present or not
   🗓 @created : 28/11/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    checkEmailAndTeamUuid(email, teamUuid, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [invitationData] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .where('email', email)
                    .andWhere('team_uuid', teamUuid)
                    .andWhere('status', status);
                return invitationData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get expiry time on the basis of code
    🗓 @created : 4/12/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getExpiryTime(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [expiryTime] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .where('code', code);
                if (!expiryTime) {
                    const err = new Error(i18n_1.default.__('user.code_invalid'));
                    err.statusCode = 400;
                    throw err;
                }
                return expiryTime;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : updated code and expiry time to null of user invitation table
  🗓 @created :4/12/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
    updateCodeExpiryTime(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION}`)
                    .where('code', code)
                    .update('code', null)
                    .update('expires_at', null);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user organizations list
    🗓 @created : 09/01/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserOrganizationList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, params, logged_in_user } } = container;
                // let organizationsList = knex(`${config.schema.USERS}.${config.tables.USER} as u`)
                // .leftJoin(`${config.schema.USERS}.${config.tables.USER_COMPANY} as uc`, 'u.uuid', 'uc.user_uuid')
                // .leftJoin(`${config.schema.USERS}.${config.tables.COMPANY_PROFILE} as cp`, 'cp.company_uuid', 'uc.company_uuid')
                // .leftJoin(`${config.schema.WORKSPACE}.${config.tables.TEAM_MEMBERS} as tm`, 'tm.user_uuid', 'uc.user_uuid')
                // .leftJoin(`${config.schema.WORKSPACE}.${config.tables.TEAM} as t`, 't.uuid','tm.team_uuid')
                // .leftJoin(`${config.schema.MASTERS}.${config.tables.FILE} as f`, 'f.uuid', 'cp.file_uuid')
                // .leftJoin(`${config.schema.USERS}.${config.tables.COMPANY} as c`, function() {
                //     this.on('c.uuid', '=', 'uc.company_uuid').orOn('c.uuid', '=', 't.company_uuid');
                // })
                // .leftJoin(`${config.schema.USERS}.${config.tables.USER} as uo`, 'c.created_by', 'uo.uuid')
                // .where('u.uuid', logged_in_user.uuid)
                // .andWhere('c.status', 'ACTIVE')
                let organizationsList = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'u.uuid', 'uc.user_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY_PROFILE} as cp`, 'cp.company_uuid', 'uc.company_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'uc.company_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as uo`, 'c.created_by', 'uo.uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'cp.file_uuid')
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`, function () {
                    this.on('t.company_uuid', '=', 'c.uuid')
                        .andOn(database_1.default.raw('t.company_uuid IS NOT NULL'));
                })
                    .where('u.uuid', logged_in_user.uuid)
                    .andWhere(function () {
                    this.where('c.status', 'ACTIVE')
                        .andWhere(function () {
                        this.whereNotNull('t.company_uuid')
                            .orWhere('c.created_by', logged_in_user.uuid);
                    });
                });
                if (str == 'CountTotalData') {
                    //
                    // filter
                    //
                    yield this.userOrganizationFilter(container, organizationsList);
                    let countQuery = organizationsList.clone().countDistinct('c.uuid as total_results');
                    let [results] = yield countQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'organizationsData') {
                    // organizationsList
                    // .select('c.name as organization_name',
                    //         knex.raw(`CONCAT_WS(' ',uo.first_name,uo.last_name)as owner`),
                    //         'c.created_by',
                    //         'u.uuid',
                    //         'c.uuid as organization_uuid',
                    //         knex.raw(`CASE 
                    //                     WHEN f.name IS NOT NULL 
                    //                     THEN TRIM(CONCAT_WS('/', '${config.app.CLOUDFRONT_URL}/company_profile_image', f.name)) 
                    //                     ELSE NULL 
                    //                     END as file_url`
                    //                 )  
                    //     )
                    organizationsList
                        .distinct([
                        'c.name as organization_name',
                        database_1.default.raw(`CONCAT_WS(' ', uo.first_name, uo.last_name) as owner`),
                        'c.created_by',
                        'u.uuid',
                        'c.uuid as organization_uuid',
                        database_1.default.raw(`CASE 
                                WHEN f.name IS NOT NULL 
                                THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/company_profile_image', f.name)) 
                                ELSE NULL 
                              END as file_url`)
                    ])
                        .groupBy([
                        'c.name',
                        'c.created_by',
                        'uo.first_name',
                        'uo.last_name',
                        'u.uuid',
                        'c.uuid',
                        'f.name',
                        'f.uuid'
                    ]);
                    //
                    // filter
                    //
                    yield this.userOrganizationFilter(container, organizationsList);
                    if (query.per_page &&
                        query.page) {
                        organizationsList.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        organizationsList.offset((query.page - 1) * query.per_page);
                    }
                    return yield organizationsList;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check email exists or not
    🗓 @created : 15/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let [user] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .whereRaw(`LOWER("email") = ?`, [email.toLowerCase()]);
                if (user) {
                    const err = new Error(i18n_1.default.__('user.user_exists'));
                    err.statusCode = 400;
                    throw err;
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user status
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateStatus(uuid, updateStatusDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userStatus = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .update(updateStatusDataModel)
                    .where('uuid', uuid);
                return userStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user's list
    🗓 @created : 23/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUsersList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                let staffQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .select('u.uuid', 'u.email', 'u.status', database_1.default.raw("CONCAT_WS(' ', u.first_name, u.last_name) as name"), 'u.created_at')
                    .select(database_1.default.raw(`json_agg(json_build_object('company_uuid', "c"."uuid", 'name', "c"."name")) as organization`))
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'uc.user_uuid', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'uc.company_uuid')
                    .groupBy('u.uuid', 'u.email', 'u.first_name', 'u.last_name', 'u.created_at');
                if (str == 'CountTotalData') {
                    //
                    //  get total count after search filter
                    //
                    this.listUserFilters(container, staffQuery);
                    let results = yield staffQuery;
                    if (results) {
                        return parseInt(results.length);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'userData') {
                    staffQuery
                        .select('u.uuid', 'u.email', database_1.default.raw("CONCAT_WS(' ', u.first_name, u.last_name) as name"), 'u.created_at')
                        .select(database_1.default.raw(`json_agg(json_build_object('company_uuid', "c"."uuid", 'name', "c"."name")) as organization`))
                        .groupBy('u.uuid', 'u.email', 'u.first_name', 'u.last_name', 'u.created_at');
                    //
                    //  search filter 
                    //
                    this.listUserFilters(container, staffQuery);
                    if (query.per_page &&
                        query.page) {
                        staffQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        staffQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield staffQuery;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user details by uuid
    🗓 @created : 26/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUsersDetails(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let [userDetails] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .select('u.uuid', 'u.email', 'u.first_name', 'u.last_name', 'up.user_profile_bio as bio', 'u.mobile_no')
                    .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END as file_url`))
                    .select(database_1.default.raw(`
                    json_agg(
                        json_build_object(
                            'company_uuid', "c"."uuid",
                            'company_name', "c"."name",
                            'vat_id', "c"."gstin",
                            'added_on', "c"."created_at"
                        )
                    ) FILTER (WHERE "c"."uuid" IS NOT NULL AND "c"."name" IS NOT NULL) as organization
                `))
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE} as up`, 'up.user_uuid', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_COMPANY} as uc`, 'uc.user_uuid', 'u.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 'uc.company_uuid')
                    .groupBy('u.uuid', 'up.user_profile_bio', 'f.name')
                    .where('u.uuid', userUuid);
                return userDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list user management API filters
    🗓 @created : 27/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserFilters(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.name.toLowerCase()}%'`);
                }
                //
                //  filter by type
                //
                if (query.email) {
                    searchQuery.andWhere('u.email', `${query.email}`);
                }
                if (query.status) {
                    searchQuery.andWhere('u.status', `${query.status}`);
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
    👑 @creator : Bhavya Nayak
    🚩 @uses : get all users
    🗓 @created : 01/04/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`)
                    .select('u.uuid', 'u.first_name', 'u.last_name', 'u.created_at')
                    .select(database_1.default.raw("CONCAT_WS(' ',u.first_name,u.last_name) as name"))
                    .where('u.status', 'ACTIVE');
                return yield userDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check user permission
    🗓 @created : 29/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    checkUserPermission(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPermission = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`)
                    .where('user_uuid', userUuid);
                return userPermission;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : insert user permission
    🗓 @created : 29/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertUserPermission(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savePermission = yield database_1.default.batchInsert(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PERMISSION}`, dataModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : insert data in user profile
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    insertUserProfile(dataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .insert(dataModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get user profile
   🗓 @created : 05/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserProfile(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [saveProfile] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .select('uuid')
                    .where('user_uuid', userUuid);
                return saveProfile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get user profile in user profile table
   🗓 @created : 05/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    updateNewUserProfile(uuid, userModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .where('uuid', uuid)
                    .update(userModel);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get user profile details by user uuid
   🗓 @created : 05/09/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getUserProfileByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .select('uuid')
                    .where('user_uuid', userUuid);
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
      🚩 @uses : return filtered data if anyone search
      🗓 @created : 05/09/2024
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */
    teamInviteMemberFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.company_uuid) {
                    searchQuery.andWhere('c.uuid', query.company_uuid);
                }
                //
                //  filter by name
                //
                if (query.sender_name) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"uu"."first_name","uu"."last_name")) LIKE '%${query.name.toLowerCase()}%'`);
                }
                if (query.team_name) {
                    searchQuery.whereRaw(`LOWER("t"."name") LIKE '%${query.team_name.toLowerCase()}%'`);
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
    👑 @creator :Sushant Shekhar
    🚩 @uses : update user profile pic in user table
    🗓 @created : 16/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateProfilePicFileUuid(uuid, updateProfilePicDataModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userStatus = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER}`)
                    .update(updateProfilePicDataModel)
                    .where('uuid', uuid);
                return userStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
* 😎 @author : Ekta Patel
* 🚩 @uses : get user profile
* 🗓 Created : 25/10/2024
*/
    getDetailsForUserMessage(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userMessage] = yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_PROFILE}`)
                    .where('user_uuid', uuid);
                if (!userMessage || !userMessage.help || !userMessage.pre_production || !userMessage.production || !userMessage.post_production) {
                    return null;
                }
                return userMessage;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : return all sent invitation data with total count
🗓 @created : 26/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
    getAllSentInvitationMembersList(container, str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, params, logged_in_user } } = container;
                let sentInviteMembersListQuery = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_INVITATION} as ui`)
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER} as u`, 'u.email', 'ui.email')
                    .leftJoin(`${constant_1.default.schema.WORKSPACE}.${constant_1.default.tables.TEAM} as t`, 'ui.team_uuid', 't.uuid')
                    .leftJoin(`${constant_1.default.schema.USERS}.${constant_1.default.tables.COMPANY} as c`, 'c.uuid', 't.company_uuid')
                    .leftJoin(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                    .whereIn('ui.status', [constant_1.default.user_invitation.PENDING, constant_1.default.user_invitation.ACCEPTED, constant_1.default.user_invitation.DECLINED])
                    .andWhere('t.company_uuid', query.company_uuid);
                if (str == 'CountTotalData') {
                    //
                    // filter
                    //
                    yield this.sentInviteMemberFilter(container, sentInviteMembersListQuery);
                    sentInviteMembersListQuery
                        .count('* as total_results');
                    let [results] = yield sentInviteMembersListQuery;
                    if (results) {
                        return parseInt(results.total_results);
                    }
                    else {
                        return 0;
                    }
                }
                else if (str == 'invitedMembersData') {
                    sentInviteMembersListQuery
                        .select('ui.uuid', 'u.first_name', 'u.last_name', 'ui.status', 'u.file_uuid', 'ui.email', 'ui.created_at', 't.name as team_name', 'ui.team_uuid', 'c.uuid as company_uuid', 'c.name as company_name', 'ui.updated_at')
                        .select(database_1.default.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${constant_1.default.app.CLOUDFRONT_URL}/user_profile_image', f.name)) ELSE NULL END as file_url`))
                        .groupBy('ui.uuid', 'u.uuid', 'f.name', 't.name', 'c.uuid');
                    //
                    // filter
                    //
                    yield this.sentInviteMemberFilter(container, sentInviteMembersListQuery);
                    if (query.per_page &&
                        query.page) {
                        sentInviteMembersListQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                        sentInviteMembersListQuery.offset((query.page - 1) * query.per_page);
                    }
                    return yield sentInviteMembersListQuery;
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
    🗓 @created : 07/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    sentInviteMemberFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by name
                //
                if (query.name) {
                    searchQuery.whereRaw(`LOWER(CONCAT_WS(' ',"u"."first_name","u"."last_name")) LIKE '%${query.name.toLowerCase()}%'`);
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
    🚩 @uses : return filtered data if anyone search
    🗓 @created : 21/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    userOrganizationFilter(container, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query, logged_in_user } } = container;
                //
                //  filter by only owner
                //
                if (query.owner == 'ME') {
                    searchQuery.andWhere('c.created_by', logged_in_user.uuid);
                }
                return searchQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new UserRepo();
//# sourceMappingURL=user.repo.js.map