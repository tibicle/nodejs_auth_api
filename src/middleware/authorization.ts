// Import Config
import config from "../config/constant";
import i18n from "../config/i18n";
//import { configureI18n } from '../config/i18n';
// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Validators

// Import Helpers
import responseHelper from "../helpers/response.helper";

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import { NextFunction, Request, Response } from "express";
import statusCodes from "http-status-codes";
import { verify } from "jsonwebtoken";


class Authorization {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate login
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async isAuthenticated(req:any, res:Response, next:NextFunction) {
        
        try {
            
            if (!req.logged_in_user) {

                if (!req.secretKey && !req.embed_token) {

                    const err:any = new Error(i18n.__('un_authorized'));
                    err.statusCode = statusCodes.UNAUTHORIZED;
                    throw err;
        
                }
            
            }
            
            next();
            

        } catch (error:any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate login
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async validateLogin(container:any) {
        
        try {

            if(container.output &&container.output.error && Object.keys(container.output.error).length) {

                const err:any = new Error(container.output.error.message);
                err.statusCode = container.output.error.code;
                throw err;

            } else {
                
                if (!container.derived.user) {
                    
                    const err:any = new Error(i18n.__('auth.wrong_credentials'));
                    err.statusCode = statusCodes.UNAUTHORIZED;
                    throw err;
                    
        
                }

            }
            return true;

        } catch (error) {
            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : validate refresh token
    🗓 @created : 12/5/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async isValidToken(req:any, res:Response, next:NextFunction) {
        
        try {
            
            if (!req.logged_in_user || req.logged_in_user.token_type != config.app.TOKEN_TYPE.refresh_token) {
                
                const err:any = new Error(i18n.__('auth.un_authorized'));
                err.statusCode = statusCodes.UNAUTHORIZED;
                throw err;
    
            }
            
            next();
            

        } catch (error:any) {

            res.status(await responseHelper.getStatusCode(error))
            .json(await responseHelper.validationErrorResponse(error));
        }

    }

}
export default new Authorization();
