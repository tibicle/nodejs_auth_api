"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Transformers
// Import Libraries
// Import Thirdparty
const joi_1 = __importDefault(require("joi"));
const userProfile = {
    editProfile: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            firstname: joi_1.default.string().allow(null),
            lastname: joi_1.default.string().allow(null),
            mobile_no: joi_1.default.string().allow(null),
            user_profile_bio: joi_1.default.string().max(50).allow(null),
            interest: joi_1.default.string().allow(null),
            help: joi_1.default.string().allow(null),
            experience_level: joi_1.default.string().allow(null),
            pre_production: joi_1.default.string().allow(null),
            production: joi_1.default.string().allow(null),
            post_production: joi_1.default.string().allow(null)
        })
    }),
    membersList: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        params: joi_1.default.object().keys({
            company_uuid: joi_1.default.string().uuid().trim().required()
        })
    }),
    acceptDeclineInvitation: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        params: joi_1.default.object().keys({
            invitation_uuid: joi_1.default.string().uuid().trim().required()
        }),
        body: joi_1.default.object().keys({
            status: joi_1.default.string().required(),
        })
    }),
    inviteMembers: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            email: joi_1.default.array().items(joi_1.default.string().email()).required(),
            team_uuid: joi_1.default.string().uuid().trim().required()
        })
    }),
    inviteVerification: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            invite_code: joi_1.default.string().required(),
            team_uuid: joi_1.default.string().required()
        })
    }),
    //
    //  body validation for user status update
    //
    userStatusValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            status: joi_1.default.string().valid('ACTIVE', 'DEACTIVE')
        })
    }),
    //
    //  body validation to store user language
    //
    userLanguage: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            language: joi_1.default.string().valid('DUTCH', 'ENGLISH')
        })
    }),
    //
    //  body validation to store user profile
    //
    userProfile: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        body: joi_1.default.object().keys({
            user_uuid: joi_1.default.string().uuid().trim().required(),
            user_profile_bio: joi_1.default.string().max(50).allow(null).messages({
                'string.max': 'The user profile bio must be less than or equal to 50 characters.',
            }),
            interest: joi_1.default.string().allow(null),
            help: joi_1.default.string().allow(null),
            experience_level: joi_1.default.string().allow(null),
            pre_production: joi_1.default.string().allow(null),
            production: joi_1.default.string().allow(null),
            post_production: joi_1.default.string().allow(null)
        })
    }),
    sentInvitationValidator: joi_1.default.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
        query: joi_1.default.object().keys({
            company_uuid: joi_1.default.string().uuid().trim().required()
        })
    })
};
exports.default = userProfile;
//# sourceMappingURL=user.validator.js.map