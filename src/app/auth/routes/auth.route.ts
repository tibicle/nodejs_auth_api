// Import Config

// Import Static

// Import Middleware

// Import Controllers
import authController from '../controllers/auth.controller';

// Import Interface

// Import Validators
import {loginSchema,singnUpSchema} from '../validators/auth.validator';
import { validator } from '../../../helpers/validator.helper';

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import express from "express";
import passportAuth from '../../../middleware/passportAuth';
import authorization from '../../../middleware/authorization';

const router = express.Router();

router.post('/signup',
      validator(singnUpSchema.signUpValidator),
      authController.signup
      )

router.post('/login', 
    validator(loginSchema.loginValidator),
    authController.login
);

router.get('/get_token',
    passportAuth.authenticateJwt, 
    authorization.isAuthenticated, 
    authController.getTokens
)

router.post('/forget_password',
    validator(loginSchema.forgetPasswordValidator),
    authController.forgetPassword
)

router.post('/reset_password',
    validator(loginSchema.resetValidator),
    authController.reset
)

router.post('/change_password',
    passportAuth.authenticateJwt, 
    authorization.isAuthenticated, 
    validator(loginSchema.changePasswordValidator),
    authController.changePassword
)

export = router;
