// Import Config
import upload from '../../../config/multer';

// Import Static

// Import Middleware
import passportAuth from '../../../middleware/passportAuth';
import authorization from '../../../middleware/authorization';

// Import Controllers
import s3Controller from '../controller/s3.controller';

// Import Validators
import { uuidSchema } from '../../../helpers/validator.helper';
import fileSchema from '../validators/file.validator';

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import express from "express";
import { validator } from '../../../helpers/validator.helper';
import multer from 'multer';

const router = express.Router();

router.post('/upload',
    passportAuth.authenticateJwt, 
    authorization.isAuthenticated,
    (req, res, next) => {
        // TODO remove custom error messages
        try {

            upload.array('files', 10)(req, res, (err:any) => {
                if (err instanceof multer.MulterError) {
                    const customError = new Error("Size limit exceed");
                    return res.status(400).json({ status: "error", message: customError.message });
                } else if (err) {
                    const customError = new Error("Allow files only of extensions jpeg|jpg|png|doc|docx|pdf|xlsx|mp4|mkv|tff extensions !!!!");
                    return res.status(400).json({ status: "error", message: customError.message });
                } else {
                    next();
                }
            });
        } catch (error:any) {
            const customError = new Error("Internal Server Error");
            return res.status(500).json({ status: 'error', message: customError.message });
        }
    },
    s3Controller.uploadFiletoS3
);

export = router;
