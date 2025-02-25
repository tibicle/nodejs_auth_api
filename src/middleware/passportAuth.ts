// Import Config
import i18n from '../config/i18n';
import config from '../config/constant';

// Import Static

// Import Helpers
import authHelper from '../app/auth/helper/auth.helper';

// Import Transformers

// Import Libraries

// Import Models
import UserRepo from '../app/user/repos/user.repo';

// Import Thirdparty
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { NextFunction, Request, Response } from "express";
import statusCodes from 'http-status-codes';
import responseHelper from '../helpers/response.helper';
const {Strategy} = require('passport-google-token');
const FacebookStrategy = require('passport-facebook-token');

class PassportAuth {

    constructor() {
        let jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.app.JWT_SECRET_KEY,
        };
        passport.use(new JwtStrategy(jwtOptions, this.verifyJwt));
        passport.use('login',new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.login));

        // 
        // added strategy for google oauth2 
        // 
        passport.use(new Strategy({
            clientID: `${config.app.GOOGLE.CLIENT_ID}`,
            clientSecret: `${config.app.GOOGLE.CLIENT_SECRET}`,
            callbackURL: `https://developers.google.com/oauthplayground`,
            passReqToCallback: true
        }, (request:any, accessToken:any, refreshToken:any, profile:any, done:any) => {
                
                return done(null, {
                    accessToken,
                    refreshToken,
                    profile
                });
            
        }));


        // 
        // added strategy for fb oauth
        // 
        passport.use(new FacebookStrategy({
            clientID: `${config.app.FACEBOOK.APP_ID}`,
            clientSecret: `${config.app.FACEBOOK.APP_SECRET}`,
            fbGraphVersion: 'v3.0',
            profileFields: ['id', 'first_name', 'last_name', 'photos', 'email', 'gender']

        },(accessToken:any, refreshToken:any, profile:any, done:any) => {

            return done(null, {
                accessToken,
                refreshToken,
                profile
            });
        }
        ));
    }

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to verify the JWT Token
    * 🗓 Created : 13/04/2022
    */
    async verifyJwt (payload:any,done:any) {
        
        try {

            const user = await UserRepo.getUserByUuid(payload.user_uuid);
            user.roles = payload.roles;
            user.token_type = payload.type;
            user.panel_type = payload.panel_type ? payload.panel_type : null;
            user.lang = user.language;

            if(user.lang == config.user_language.DUTCH){

                i18n.setLocale('nl')
                

            }else{

                i18n.setLocale('en')

            }
            if(user.status == 'DEACTIVE'){
                 return done(null, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
    
        } catch (error) {
            
            const err:any = new Error(i18n.__('auth.un_authorized'))
            err.statusCode = statusCodes.UNAUTHORIZED;
            return done(err, false);
    
        }
    }

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to login the user
    * 🗓 Created : 21/4/2022
    */
    async login (email:string, password:string, done:any) {

        try {
            
            const user = await UserRepo.getUserByEmail(email);

            if(!user){
                
                const err:any = new Error(i18n.__('auth.email_not_exists'));
                err.statusCode = statusCodes.UNAUTHORIZED;
                throw err;
            }

            if(user.status != 'ACTIVE') {
                const err:any = new Error(i18n.__('user.deactived'));
                err.statusCode = statusCodes.UNAUTHORIZED;
                throw err;
            }

            if(user.password == null  && user.google_id != null){
                const err:any = new Error(i18n.__('auth.provider_error'));
                err.statusCode = statusCodes.UNAUTHORIZED;
                throw err;
            }

            //
            // Compare the password
            //
            const pass = await authHelper.comparePassword(password, user.password);
            if(pass) {
                
                return done(null,user);

            } else {
                
                const err:any = new Error(i18n.__('auth.wrong_credentials'));
                err.statusCode = statusCodes.UNAUTHORIZED;
                throw err;

            }

        } catch (error) {

            return done(error,false);

        }

    }

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : authenticate Jwt 
    * 🗓 Created : 13/4/2022
    */
    async authenticateJwt (req:any, res:Response, next:NextFunction) {
        
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

            const secretKey = req.headers.authorization.split(' ')[1];
            
            const embed_token = req.headers.authorization.split(' ')[1];

            if (secretKey == config.app.EXPORT_SECERET_KEY) {
                req.secretKey = true;
                next();

            }else if(embed_token == config.app.EMBED_TOKEN){
                req.embed_token = true;
                next()
            }
            else{
                passport.authenticate('jwt', { session: false }, async (error:any, user:any, info:any) => {

                    if (info) {
        
                        if (info.message == 'jwt expired') {
        
                            if (config.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
        
                                const err: any = new Error(i18n.__('un_authorized'));
                                err.statusCode = statusCodes.UNAUTHORIZED;
                                res.status(await responseHelper.getStatusCode(err))
                                .json(await responseHelper.validationErrorResponse(err));
        
                                return;
        
                            } else {
        
                                const err: any = new Error(i18n.__('un_authorized'));
                                err.statusCode = statusCodes.PAYMENT_REQUIRED;
                                res.status(await responseHelper.getStatusCode(err))
                                .json(await responseHelper.validationErrorResponse(err));
        
                                return;
        
                            }
                        } else {
        
                            const err: any = new Error(i18n.__('un_authorized'));
                            err.statusCode = statusCodes.UNAUTHORIZED;
                            res.status(await responseHelper.getStatusCode(err))
                            .json(await responseHelper.validationErrorResponse(err));
        
                            return;
        
                        }
        
                    }else {

                        if(user){

                            if (user.token_type == config.app.TOKEN_TYPE.refresh_token &&
                                config.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
            
                                req.logged_in_user = user;
                                req.token_type = user.token_type;
                                req.panel_type = user.panel_type;
            
                                next();
            
                            } else if (user.token_type == config.app.TOKEN_TYPE.access_token &&
                                !config.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
            
                                req.logged_in_user = user;
                                req.token_type = user.token_type;
                                req.panel_type = user.panel_type;
            
                                next();
            
                            }

                        }
                         else {
        
                            const err: any = new Error(i18n.__('un_authorized'));
                            err.statusCode = statusCodes.UNAUTHORIZED;
                            res.status(await responseHelper.getStatusCode(err))
                            .json(await responseHelper.validationErrorResponse(err));
        
                            return;
        
                        }
        
                    }
                
                    // if (user) {
                    //     req.logged_in_user = user;
                    // }
                    // next();
                })(req, res, next);
            }
        }
    }
    
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : Login the user
    * 🗓 Created : 21/4/2022
    */
    async loginUser(req:any,container:any) {
        
        return new Promise( async (resolve,reject) => {
            return await passport.authenticate('login', (err:any, user:any, info:any) => {
                if (err) {  
    
                    container.output.error = {
                        message: err.message,
                        code: err.statusCode
                    }
                    
                    //res.status(err.statusCode).send(err.message);
                    
                }
                if (info !== undefined) {
                    
                    container.output.error = {
                        message: info.message,
                        code: statusCodes.UNAUTHORIZED
                    }
                    
                } else {
                    
                    container.derived.user = {};
                    container.derived.user = user;

                }
                
                resolve(container);
            })(req,container);
        });
        
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate google auth using passport
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async  authenticateGoogle(req:any, container:any) {
        return new Promise((resolve, reject) => {
            return passport.authenticate('google-token', (err:any, user:any, info:any) => {
                
                if (err) {  
                    container.output.error = {
                        message: err.message,
                        code: err.statusCode
                    }
                    
                    //res.status(err.statusCode).send(err.message);
                    
                }
                if (info !== undefined) {
    
                    container.output.error = {
                        message: info.message,
                        code: statusCodes.UNAUTHORIZED
                    }
    
                } else {
                    
                    container.derived.user = {};
                    
                    container.derived.user = user ? user.profile._json : null;
                    
                }
                resolve(container);
            })(req,container);
        });
        
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate facebook auth using passport
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async authenticateFacebook(req:any, res:any, container:any) {

        return new Promise((resolve, reject) => {
            return passport.authenticate('facebook-token', (err:any, user:any, info:any) => {

                if (err) {  
                    container.output.error = {
                        message: err.message,
                        code: err.statusCode
                    }
                    
                    // res.status(err.statusCode).send(err.message);
                    
                }

                if (info !== undefined) {

                    container.output.error = {
                        message: info.message,
                        code: statusCodes.UNAUTHORIZED
                    }

                } else {
                    
                    container.derived.user = {};
                    
                    container.derived.user = user ? user.profile._json : null;
                    
                }
                resolve(container);
            })(req,container);
        });
        
    }

}

export default new PassportAuth();