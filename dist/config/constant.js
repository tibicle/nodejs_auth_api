"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const process_1 = require("process");
dotenv_1.default.config();
exports.default = {
    app: {
        PORT: process.env.PORT,
        ENVIRONMENT: process.env.NODE_ENV,
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_PORT: process.env.DB_PORT,
        DB_CHARSET: process.env.DB_CHARSET,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
        JWT_SECRET_KEY_REFRESH: process_1.env.JWT_SECRET_KEY_REFRESH,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        PER_PAGE: 10,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        BREVO_API_KEY: process.env.BREVO_API_KEY,
        AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
        REFRESH_TOKEN_PATH: ['/get_token'],
        DEFAULT_PASS: 'admin@123',
        EMAIL_FROM: process.env.EMAIL_FROM,
        FROM_EMAIL: process.env.FROM_EMAIL,
        VIDEO_FREDO_FE_URL: process.env.VIDEO_FREDO_FE_URL,
        BE_URL: process.env.BE_URL,
        FORGOT_TOKEN_EXPIRE_TIME: process.env.FORGOT_TOKEN_EXPIRE_TIME,
        VIDEO_FREDO_BASE_URL: process.env.VIDEO_FREDO_BASE_URL,
        QUESTANK_BE_URL: process.env.QUESTANK_BE_URL,
        OTP_BASE_URL: process.env.OTP_BASE_URL,
        OTP_API_KEY: process.env.OTP_API_KEY,
        CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
        FPS: process.env.FPS,
        PRE_SIGNED_URL_EXPIRATION_SECONDS: process.env.PRE_SIGNED_URL_EXPIRATION_SECONDS,
        EXPORT_SECERET_KEY: process.env.EXPORT_SECERET_KEY,
        LAMDA_URL: process.env.LAMDA_URL,
        VIDEO_FREDO_BE_URL: process.env.VIDEO_FREDO_BE_URL,
        ADMIN_VIDEO_FREDO_FE_URL: process.env.ADMIN_VIDEO_FREDO_FE_URL,
        KIOSK_SECRET: process.env.KIOSK_SECRET,
        HLS_SERVER_URL: process.env.HLS_SERVER_URL,
        AWS_IAM_ROLE: process.env.AWS_IAM_ROLE,
        AWS_MEDIACONVERT_QUEUE: process.env.AWS_MEDIACONVERT_QUEUE,
        TOKEN_TYPE: {
            access_token: 'access_token',
            refresh_token: 'refresh_token'
        },
        GENDER: {
            MALE: "MALE",
            FEMALE: "FEMALE"
        },
        FACEBOOK: {
            APP_ID: process.env.FACEBOOK_APP_ID,
            APP_SECRET: process.env.FACEBOOK_APP_SECRET
        },
        GOOGLE: {
            CALLBACKURL: process.env.GOOGLE_CALLBACK_URL,
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
        },
        PANEL_TYPE: {
            FRONT_END: 'front_end',
            BACK_END: 'back_end'
        },
        AI_ASSISTANT: {
            AI_ASSISTANT_KEY: process.env.AI_ASSISTANT_KEY,
            ASSISTANT_ID: process.env.ASSISTANT_ID
        },
        EMBED_TOKEN: process.env.EMBED_TOKEN,
        HLS_CREATE_URL: process.env.HLS_CREATE_URL,
        AWS_THUMBNAIL_QUEUE: process.env.AWS_THUMBNAIL_QUEUE,
        AWS_AUDIO_QUEUE: process.env.AWS_AUDIO_QUEUE,
        AWS_FRAME_QUEUE: process.env.AWS_FRAME_QUEUE,
        AWS_VIDEO_DETAILS_QUEUE: process.env.AWS_VIDEO_DETAILS_QUEUE,
        AWS_VIDEO_CONVERT_QUEUE: process.env.AWS_VIDEO_CONVERT_QUEUE,
        AWS_EXPORT_QUEUE: process.env.AWS_EXPORT_QUEUE,
        AWS_THUMBNAIL_DEFINITION: process.env.AWS_THUMBNAIL_DEFINITION,
        AWS_AUDIO_DEFINITION: process.env.AWS_AUDIO_DEFINITION,
        AWS_FRAME_DEFINITION: process.env.AWS_FRAME_DEFINITION,
        AWS_VIDEO_DETAILS_DEFINITION: process.env.AWS_VIDEO_DETAILS_DEFINITION,
        AWS_VIDEO_CONVERT_DEFINITION: process.env.AWS_VIDEO_CONVERT_DEFINITION,
        AWS_EXPORT_DEFINITION: process.env.AWS_EXPORT_DEFINITION
    },
    tables: {
        FILE: 'file',
        VIDEO_FRAME: 'video_frame',
        USER_SOCKET: 'user_socket',
        USER: 'user',
        USER_ROLE: 'user_role',
        COMPANY: 'company',
        USER_COMPANY: 'user_company',
        LIBRARY: 'library',
        PRODUCTION: 'production',
        PRODUCTION_MEDIA: 'production_media',
        PRODUCTION_TIMELINE: 'production_timeline',
        ROLE: 'role',
        PRODUCTION_EXPORT: 'production_export',
        CATEGORY: 'category',
        TAG: 'tag',
        TEAM_MEMBERS: 'team_members',
        TEAM: 'team',
        USER_INVITATION: 'user_invitation',
        VIDEO_CONFIGURATION: 'video_configuration',
        USER_PERMISSION: 'user_permission',
        TUTORIAL_STATIC_MANAGEMENT: 'tutorial_static_management',
        PRODUCTION_SEQUENCE: 'production_sequence',
        ERROR_LOG_STATUS: 'error_log_status',
        FONT: 'font',
        SUBSCRIPTION: 'subscription',
        USER_SUBSCRIPTION: 'user_subscription',
        PAYMENT: 'payment',
        USER_ADDON: 'user_addon',
        TUTORIAL: 'tutorial',
        MODULE: 'module',
        STATIC_PAGE: 'static_page',
        USER_PROFILE: 'user_profile',
        COMPANY_PROFILE: 'company_profile',
        USER_THREAD: 'user_thread',
        COUNTRY: 'country',
        AWS_JOB: 'aws_job',
        LOW_RESOLUTION_FILE: "low_resolution_file"
    },
    system_roles: {
        SUPER_ADMIN: 'super_admin',
        USER: 'user',
        TEAM_MANAGER: 'team_manager',
        VF_ADMIN_CONTENT_MANAGER: 'VF_admin_content_manager',
        VF_ADMIN_CLIENT_MANAGER: 'VF_admin_client_manager',
        VF_ADMIN_ADMINISTRATOR: 'VF_admin_administrator',
        OWNER: 'owner'
    },
    schema: {
        USERS: 'users',
        MASTERS: 'masters',
        VIDEO_EDITOR: 'video_editor',
        WORKSPACE: 'workspace',
        SUBSCRIPTIONS: 'subscriptions',
        ACADEMY: 'academy',
        AI_ASSISTANT: 'ai_assistant'
    },
    file: {
        signatures: [
            {
                key: 'iVBORw0KGgo',
                value: 'image/png'
            },
            {
                key: '/9j/',
                value: 'image/jpg'
            }
        ],
        status: {
            PROCESSING: "PROCESSING",
            COMPLETED: "COMPLETED",
            IN_PROGRESS: "IN_PROGRESS",
            FAILED: "FAILED"
        }
    },
    PROFILE_UPDATE: {
        status: {
            APPROVED: 'APPROVED',
            REJECTED: 'REJECTED',
            CANCELLED: 'CANCELLED',
            PENDING: 'PENDING'
        }
    },
    status: {
        ACTIVE: 'ACTIVE',
        DEACTIVE: 'DEACTIVE'
    },
    file_status: {
        PENDING: 'PENDING',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        FAILED: 'FAILED'
    },
    email_templates: {
        Activation: "activation",
        FORGOT_PASSWORD: "forgotPass",
        CONTACT_US: "contactUs",
        INVITE_MEMBER: "inviteMember",
        EXPORT_VIDEO: "exportVideo",
        FORGOT_PASSWORD_DUTCH: "forgetPassDutch",
        EXPORT_VIDEO_DUTCH: "exportVideoDutch",
        INVITE_MEMBER_DUTCH: "inviteMemberDutch",
        VERIFY_EMAIL: "emailVerify",
        VERIFY_EMAIL_DUTCH: "emailVerifyDutch",
        STAFF_EMAIL: "staffEmail",
        UPLOAD_FILE_FAILED: "uploadFileFailed"
    },
    expiration_time: {
        PRE_SIGNED_URL: "30000"
    },
    media_type: {
        video: "video",
        image: "image"
    },
    frame: {
        thumbnail_size: "100x100"
    },
    LIBRARY_LISTING_TYPE: {
        PRODCUTION_MEDIA_LIST: "PRODUCTION_MEDIA_LIST"
    },
    layer_type: {
        AUDIO: "AUDIO",
        IMAGE: "IMAGE",
        TEXT: "TEXT",
        VIDEO: "VIDEO"
    },
    tag_type: {
        PRODUCTION: "PRODUCTION",
        LIBRARY: "LIBRARY",
        TEAM: "TEAM",
        TUTORIAL: "TUTORIAL"
    },
    user_invitation: {
        PENDING: "PENDING",
        ACCEPTED: "ACCEPTED",
        DECLINED: "DECLINED"
    },
    resolution_type: {
        "640x480": "SD",
        "1280x720": "HD",
        "1920x1080": "FHD",
        "2560x1440": "QHD",
        "2048x1080": "2K",
        "3840x2160": "4K",
        "7680x4320": "8K"
    },
    error_log_status: {
        OPEN: "OPEN",
        RESOLVED: "RESOLVED",
        CLOSE: "CLOSE"
    },
    font_visibility: {
        PUBLIC: "PUBLIC",
        PRIVATE: "PRIVATE"
    },
    folder: {
        LIBRARY: "library",
        PRODUCTION: "production",
        EXPORT: "export",
        OUTPUT_HLS: "output_hls"
    },
    user_language: {
        DUTCH: "DUTCH",
        ENGLISH: "ENGLISH"
    },
    tutorial_image: {
        THUMBNAIL: "TUTORIAL_THUMBNAIL",
        COVER: "TUTORIAL_COVER"
    },
    tutorial_status: {
        PUBLISHED: "PUBLISHED",
        UNPUBLISHED: "UNPUBLISHED",
        PENDING: "PENDING"
    },
    subscription_status: {
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
        DEACTIVE: 'DEACTIVE',
        RENEWED: 'RENEWED',
        CANCELED: 'CANCELED',
        EXPIRED: 'EXPIRED',
        CANCEL_SYSTEM: 'CANCEL_SYSTEM',
        IS_FUTURE_RENEW: 'IS_FUTURE_RENEW',
        APPROVED: 'APPROVED'
    },
    subscription_plan: {
        SOLO: 'Solo',
        TEAM: 'Team',
        ENTERPRISE: 'Enterprise'
    },
    payment_type: {
        ADDON: 'ADDON',
        RENEW: 'RENEW'
    },
    production_status: {
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        FAILED: 'FAILED'
    },
    user_access: {
        SOLO: '1',
        TEAM: '5',
        ENTERPRISE: '0'
    },
    sequence_status: {
        PRE_PRODUCTION: 'PRE_PRODUCTION',
        PRODUCTION: 'PRODUCTION',
        COMPLETED: 'COMPLETED',
        EXPORTED: 'EXPORTED'
    },
    folder_prefix: {
        COMPANY: 'cm',
        USER: 'us',
        PRODUCTION: 'production'
    },
    job_status: {
        IN_PROCESS: 'IN_PROCESS',
        COMPLETED: 'COMPLETED',
        FAILED: 'FAILED'
    },
    error_log_type: {
        PRODUCTION: "PRODUCTION",
        LIBRARY: "LIBRARY"
    },
    aspect_ratio: {
        "16:9": "16:9",
        "9:16": "9:16",
        "1:1": "1:1",
        "1.19:1": "1.19:1",
        "4:5": "4:5",
        "5:4": "5:4"
    }
};
//# sourceMappingURL=constant.js.map