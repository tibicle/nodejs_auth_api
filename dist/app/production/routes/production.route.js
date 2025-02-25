"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
// Import Controllers
const production_controller_1 = __importDefault(require("../controller/production.controller"));
// Import Interface
// Import Validators
const validator_helper_1 = require("../../../helpers/validator.helper");
const production_validator_1 = __importDefault(require("../validator/production.validator"));
// Import Helpers
// Import Transformers
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const router = express_1.default.Router();
//
//  list production
//
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.production_management.production.read), (0, validator_helper_1.validator)(production_validator_1.default.productionList), production_controller_1.default.listProduction);
//
//  get sequence status
//
router.get('/sequence_status', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, production_controller_1.default.getSequenceStatus);
//
//  list production
//
router.get('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, production_controller_1.default.listProduction);
//
//  list production media
//
router.get('/:uuid/media', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), production_controller_1.default.listProductionMedia);
//
//  list production media
//
router.get('/production_member', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(production_validator_1.default.productionMember), production_controller_1.default.listProductionMembers);
//
// get production by uuid
//
router.get('/:production_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), production_controller_1.default.getProduction);
//
//  get production storage
//
router.get('/:production_uuid/storage', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), production_controller_1.default.getProductionStorage);
//
//  add production media
//
router.post('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(production_validator_1.default.saveProductionMedia), production_controller_1.default.saveProductionMedia);
//
//  add layer
//
router.post('/:production_uuid/layer', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.addLayer), production_controller_1.default.addLayer);
//
//  update layer
//
router.put('/:production_uuid/layer', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.updateLayer), production_controller_1.default.updateLayer);
//
//  get layer
//
router.get('/:production_uuid/layer', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.getLayer), production_controller_1.default.getLayer);
//
//  create new production
//
router.post('/create', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.production_management.production.create), (0, validator_helper_1.validator)(production_validator_1.default.createProductionSchema), production_controller_1.default.createProduction);
//
//  update production
//
router.put('/:production_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.production_management.production.update), (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.updateProductionSchema), production_controller_1.default.updateProduction);
//
//  delete production  
//
router.delete('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.production_management.production.delete), (0, validator_helper_1.validator)(production_validator_1.default.deleteProduction), production_controller_1.default.deleteProduction);
//
//  delete production media
//
router.delete('/media/:uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.uuidSchema), production_controller_1.default.deleteProductionMedia);
//
//  get production sequence
//
router.get('/:production_uuid/sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), production_controller_1.default.getProductionSequence);
//
//  get production sequence
//
router.get('/:production_uuid/sequence/:sequence_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), production_controller_1.default.getProductionSequenceByUuid);
//
//  create production sequence
//
router.post('/:production_uuid/sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.createSequence), production_controller_1.default.createProductionSequence);
//
//  update production sequence
//
router.put('/:production_uuid/sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(production_validator_1.default.updateSequence), production_controller_1.default.updateProductionSequence);
//
//  update production sequence status
//
router.patch('/:production_uuid/sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(production_validator_1.default.updateSequenceStatus), production_controller_1.default.updateProductionSequenceStatus);
//
//  delete production sequence
//
router.delete('/:production_uuid/sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.productionUuidSchema), (0, validator_helper_1.validator)(production_validator_1.default.deleteSequence), production_controller_1.default.deleteProductionSequence);
//
//  create duplicate production sequence
//
router.post('/:sequence_uuid/duplicate_sequence', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(validator_helper_1.sequenceUuidSchema), production_controller_1.default.duplicateSequence);
//
//  get aspect ratio
//
router.get('/aspect_ratio/ratio', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, production_controller_1.default.getAspectRatio);
//
//  update aspect ratio
//
router.patch('/aspect_ratio/sequence/:sequence_uuid', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (0, validator_helper_1.validator)(production_validator_1.default.updateAspectRatio), production_controller_1.default.updateAspectRatio);
module.exports = router;
//# sourceMappingURL=production.route.js.map