"use strict";
// Import Config
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Static
// Import Middleware
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
// Import Controllers
const video_controller_1 = __importDefault(require("../controller/video.controller"));
const awsSns_service_1 = __importDefault(require("../../../resources/awsBatch/awsSns.service"));
// Import Helpers
// Import Transformers
// Import Libraries
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/convert', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, video_controller_1.default.videoToFrame);
// get video configuration
router.get('/configuration', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, video_controller_1.default.getVideoConfiguration);
// update video details
router.put('/', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, video_controller_1.default.updateMediaDetails);
//
//  get sns notification
//
router.post('/batch_notification', awsSns_service_1.default.getSnsNotification);
module.exports = router;
//# sourceMappingURL=video.route.js.map