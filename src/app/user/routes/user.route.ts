// Import Config

// Import Static

// Import Middleware
import passportAuth from '../../../middleware/passportAuth';
import authorization from '../../../middleware/authorization';

// Import Controllers
import userController from '../controllers/user.controller';

// Import Interface

// Import Validators
import { uuidSchema, validator } from '../../../helpers/validator.helper';

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import express from "express";

const router = express.Router();

router.get('/me',
    passportAuth.authenticateJwt,
    authorization.isAuthenticated,
    userController.getMe
);

export = router;
