"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const multer_1 = __importDefault(require("../../../config/multer"));
const permission_1 = __importDefault(require("../../../config/permission"));
// Import Static
// Import Middleware
const passportAuth_1 = __importDefault(require("../../../middleware/passportAuth"));
const authorization_1 = __importDefault(require("../../../middleware/authorization"));
// Import Controllers
const s3_controller_1 = __importDefault(require("../controller/s3.controller"));
const file_validator_1 = __importDefault(require("../validators/file.validator"));
// Import Transformers
// Import Libraries
const permissionLibrary_1 = require("../../../library/permissionLibrary");
// Import Models
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const validator_helper_1 = require("../../../helpers/validator.helper");
const multer_2 = __importDefault(require("multer"));
const router = express_1.default.Router();
// upload file to s3 bucket
// router.post('/upload', 
//     passportAuth.authenticateJwt, 
//     authorization.isAuthenticated,
//     upload.array('files',10),
//     s3Controller.uploadFiletoS3
// );
router.post('/upload', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, (req, res, next) => {
    // TODO remove custom error messages
    try {
        multer_1.default.array('files', 10)(req, res, (err) => {
            if (err instanceof multer_2.default.MulterError) {
                const customError = new Error("Size limit exceed");
                return res.status(400).json({ status: "error", message: customError.message });
            }
            else if (err) {
                const customError = new Error("Allow files only of extensions jpeg|jpg|png|doc|docx|pdf|xlsx|mp4|mkv|tff extensions !!!!");
                return res.status(400).json({ status: "error", message: customError.message });
            }
            else {
                next();
            }
        });
    }
    catch (error) {
        const customError = new Error("Internal Server Error");
        return res.status(500).json({ status: 'error', message: customError.message });
    }
}, s3_controller_1.default.uploadFiletoS3);
// const storeFormData = (req:any, res:any, next:any) => {
//     if (req.method === 'POST' && req.is('multipart/form-data')) {
//         console.log("insiddeeee iffff");
//         // console.log(req);
//       req.tempData = { ...req.body };
//       console.log("req.tempdata!!!!!!!!!!!!!!!!!!");
//       console.log(req.tempData);
//     }
//     next();
//   };
// router.post('/upload',
//     passportAuth.authenticateJwt,
//     authorization.isAuthenticated,
//     // storeFormData, // Store form data before multer processes files
//     upload.fields([
//       { name: 'files', maxCount: 10 },
//       { name: 'type' }
//     ]),
//     (req:any, res, next) => {
//       try {
//         console.log("Type in route handler:", req.tempData?.type); // Debugging line
//         const { type } = req.tempData || {};
//         if (!type) {
//           return res.status(400).json({ status: "error", message: "Type is required." });
//         }
//         next();
//       } catch (error) {
//         return res.status(500).json({ status: 'error', message: "Internal Server Error" });
//       }
//     },
//     s3Controller.uploadFiletoS3
//   );
router.get('/pre_signed_url', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, permissionLibrary_1.Permission.isActionPermission(permission_1.default.library_management.library.create), (0, validator_helper_1.validator)(file_validator_1.default.uploadFile), s3_controller_1.default.getPreSignedUrl);
router.post('/file', passportAuth_1.default.authenticateJwt, authorization_1.default.isAuthenticated, s3_controller_1.default.saveExportFile);
module.exports = router;
//# sourceMappingURL=file.route.js.map