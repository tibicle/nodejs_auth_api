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
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const clientS3_1 = __importDefault(require("./clientS3"));
const constant_1 = __importDefault(require("./constant"));
const createExportFolder_service_1 = __importDefault(require("../app/export/services/createExportFolder.service"));
const production_repo_1 = __importDefault(require("../app/production/repo/production.repo"));
const calculateS3Usage_helper_1 = __importDefault(require("../helpers/calculateS3Usage.helper"));
const export_repo_1 = __importDefault(require("../app/export/repo/export.repo"));
// CREATE MULTER FUNCTION FOR UPLOAD
let fileUpload = (0, multer_1.default)({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE
    storage: (0, multer_s3_1.default)({
        s3: clientS3_1.default,
        acl: 'private',
        // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
        bucket: `${constant_1.default.app.AWS_BUCKET_NAME}`,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function (req, file, cb) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.query.type == 'INVOICE') {
                        var folderName = 'transaction';
                        const fileName = file.originalname.replace(/\s/g, "_");
                        const filePath = `${folderName}/${Date.now()}_${fileName}`;
                        cb(null, filePath);
                    }
                    else if (req.query.type == 'TEAM') {
                        var folderName = 'team_profile_image';
                        const fileName = file.originalname.replace(/\s/g, "_");
                        const filePath = `${folderName}/${Date.now()}_${fileName}`;
                        cb(null, filePath);
                    }
                    else if (req.query.type == 'USER_PROFILE_PIC') {
                        var folderName = 'user_profile_image';
                        const fileName = file.originalname.replace(/\s/g, "_");
                        const filePath = `${folderName}/${Date.now()}_${fileName}`;
                        cb(null, filePath);
                    }
                    else if (req.query.type == 'FONT') {
                        var folderName = 'fonts';
                        const fileName = file.originalname.replace(/\s/g, "_");
                        const filePath = `${folderName}/${Date.now()}_${fileName}`;
                        cb(null, filePath);
                    }
                    else if (req.query.type == 'COMPANY_PROFILE_PIC') {
                        var folderName = 'company_profile_image';
                        const fileName = file.originalname.replace(/\s/g, "_");
                        const filePath = `${folderName}/${Date.now()}_${fileName}`;
                        cb(null, filePath);
                    }
                    else if (req.query.type == 'EXPORT_EMBED_PIC') {
                        if (req.query.production_uuid && req.query.export_uuid) {
                            //
                            //  get export details by uuid
                            //
                            const exportDetails = yield export_repo_1.default.checkExportFileByUuid(req.query.export_uuid);
                            const container = {
                                input: {
                                    body: {
                                        production_uuid: req.query.production_uuid
                                    },
                                    logged_in_user: {
                                        uuid: exportDetails.created_by
                                    }
                                }
                            };
                            //
                            //  create export folder
                            //
                            yield (0, createExportFolder_service_1.default)(container);
                            //
                            //  get production details by uuid
                            //
                            const productionDetails = yield production_repo_1.default.checkProductionByUuid(req.query.production_uuid);
                            //
                            //  get production folder path
                            //
                            const productionFolderPath = yield calculateS3Usage_helper_1.default.getProductionFolderPath(productionDetails.company_uuid, exportDetails.created_by, productionDetails);
                            const fileName = file.originalname.replace(/\s/g, "_");
                            const filePath = `${productionFolderPath}/${Date.now()}_${fileName}`;
                            cb(null, filePath);
                        }
                    }
                    else {
                        const fileName = (file.originalname).replace(/\s/g, "_");
                        cb(null, Date.now() + '_' + fileName);
                    }
                }
                catch (err) {
                    cb(err);
                }
            });
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|doc|docx|pdf|xlsx|mp4|mkv|mov|ttf/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: Allow only jpeg|jpg|png|doc|docx|pdf|xlsx|mp4|mkv|ttf extensions !!!!");
        }
    }
});
exports.default = fileUpload;
//# sourceMappingURL=multer.js.map