"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
// Import Controllers
const export_controller_1 = __importDefault(require("../controller/export.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const export_validator_1 = __importDefault(require("../validators/export.validator"));
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const router = express_1.default.Router();
//
//  save export file details
//
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(export_validator_1.default.saveExportDetails), export_controller_1.default.saveExportFileDetails);
//
//  get export auto settings
//
router.get('/auto/:production_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), export_controller_1.default.getExportAutoSettings);
//
//  get exported videos
//
router.get('/videos/:production_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), export_controller_1.default.getExportedVideos);
//
//  get embed code in response
//
router.get('/embed_video', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(export_validator_1.default.embedVideo), export_controller_1.default.getEmbedVideo);
//
//  get embed code in response
//
router.get('/embed_code', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(export_validator_1.default.embedVideo), export_controller_1.default.getEmbedCode);
//
//  get export file details by uuid
//
router.get('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), export_controller_1.default.getExportFileDetails);
//
//  update export file status
//
router.patch('/status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(export_validator_1.default.updateExportStatus), export_controller_1.default.updateExportFileStatus);
//
//  update export hls video data
//
router.put('/hls/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), export_controller_1.default.updateExportHlsData);
//
//  update export status by job id
//
router.put('/hls_status/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, export_controller_1.default.updateHlsStatus);
//
//  update export data
//
router.put('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), (0, validator_helper_1.validator)(export_validator_1.default.updateExport), export_controller_1.default.updateExport);
//
//  delete exported videos
//
router.delete('/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), export_controller_1.default.deleteExportedVideo);
//
//  update export status by job id
//
router.post('/create_hls', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(export_validator_1.default.hlsVideoCreate), export_controller_1.default.createHlsVideo);
//
//  get sns notification
//
router.post('/hls_notification', export_controller_1.default.getSnsNotification);
module.exports = router;
//# sourceMappingURL=export.route.js.map