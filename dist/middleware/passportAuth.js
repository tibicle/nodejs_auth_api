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
// Import Config
const i18n_1 = __importDefault(require("../config/i18n"));
const constant_1 = __importDefault(require("../config/constant"));
// Import Static
// Import Helpers
const auth_helper_1 = __importDefault(require("../app/auth/helper/auth.helper"));
// Import Transformers
// Import Libraries
// Import Models
const user_repo_1 = __importDefault(require("../app/user/repos/user.repo"));
// Import Thirdparty
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const response_helper_1 = __importDefault(require("../helpers/response.helper"));
const { Strategy } = require('passport-google-token');
const FacebookStrategy = require('passport-facebook-token');
class PassportAuth {
    constructor() {
        let jwtOptions = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: constant_1.default.app.JWT_SECRET_KEY,
        };
        passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, this.verifyJwt));
        passport_1.default.use('login', new passport_local_1.Strategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.login));
        // 
        // added strategy for google oauth2 
        // 
        passport_1.default.use(new Strategy({
            clientID: `${constant_1.default.app.GOOGLE.CLIENT_ID}`,
            clientSecret: `${constant_1.default.app.GOOGLE.CLIENT_SECRET}`,
            callbackURL: `https://developers.google.com/oauthplayground`,
            passReqToCallback: true
        }, (request, accessToken, refreshToken, profile, done) => {
            return done(null, {
                accessToken,
                refreshToken,
                profile
            });
        }));
        // 
        // added strategy for fb oauth
        // 
        passport_1.default.use(new FacebookStrategy({
            clientID: `${constant_1.default.app.FACEBOOK.APP_ID}`,
            clientSecret: `${constant_1.default.app.FACEBOOK.APP_SECRET}`,
            fbGraphVersion: 'v3.0',
            profileFields: ['id', 'first_name', 'last_name', 'photos', 'email', 'gender']
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, {
                accessToken,
                refreshToken,
                profile
            });
        }));
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to verify the JWT Token
    * 🗓 Created : 13/04/2022
    */
    verifyJwt(payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_repo_1.default.getUserByUuid(payload.user_uuid);
                user.roles = payload.roles;
                user.token_type = payload.type;
                user.panel_type = payload.panel_type ? payload.panel_type : null;
                user.lang = user.language;
                if (user.lang == constant_1.default.user_language.DUTCH) {
                    i18n_1.default.setLocale('nl');
                }
                else {
                    i18n_1.default.setLocale('en');
                }
                if (user.status == 'DEACTIVE') {
                    return done(null, false);
                }
                if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            }
            catch (error) {
                const err = new Error(i18n_1.default.__('auth.un_authorized'));
                err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                return done(err, false);
            }
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to login the user
    * 🗓 Created : 21/4/2022
    */
    login(email, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_repo_1.default.getUserByEmail(email);
                if (!user) {
                    const err = new Error(i18n_1.default.__('auth.email_not_exists'));
                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                    throw err;
                }
                if (user.status != 'ACTIVE') {
                    const err = new Error(i18n_1.default.__('user.deactived'));
                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                    throw err;
                }
                if (user.password == null && user.google_id != null) {
                    const err = new Error(i18n_1.default.__('auth.provider_error'));
                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                    throw err;
                }
                //
                // Compare the password
                //
                const pass = yield auth_helper_1.default.comparePassword(password, user.password);
                if (pass) {
                    return done(null, user);
                }
                else {
                    const err = new Error(i18n_1.default.__('auth.wrong_credentials'));
                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                    throw err;
                }
            }
            catch (error) {
                return done(error, false);
            }
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : authenticate Jwt
    * 🗓 Created : 13/4/2022
    */
    authenticateJwt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                const secretKey = req.headers.authorization.split(' ')[1];
                const embed_token = req.headers.authorization.split(' ')[1];
                if (secretKey == constant_1.default.app.EXPORT_SECERET_KEY) {
                    req.secretKey = true;
                    next();
                }
                else if (embed_token == constant_1.default.app.EMBED_TOKEN) {
                    req.embed_token = true;
                    next();
                }
                else {
                    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => __awaiter(this, void 0, void 0, function* () {
                        if (info) {
                            if (info.message == 'jwt expired') {
                                if (constant_1.default.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
                                    const err = new Error(i18n_1.default.__('un_authorized'));
                                    err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                                    res.status(yield response_helper_1.default.getStatusCode(err))
                                        .json(yield response_helper_1.default.validationErrorResponse(err));
                                    return;
                                }
                                else {
                                    const err = new Error(i18n_1.default.__('un_authorized'));
                                    err.statusCode = http_status_codes_1.default.PAYMENT_REQUIRED;
                                    res.status(yield response_helper_1.default.getStatusCode(err))
                                        .json(yield response_helper_1.default.validationErrorResponse(err));
                                    return;
                                }
                            }
                            else {
                                const err = new Error(i18n_1.default.__('un_authorized'));
                                err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                                res.status(yield response_helper_1.default.getStatusCode(err))
                                    .json(yield response_helper_1.default.validationErrorResponse(err));
                                return;
                            }
                        }
                        else {
                            if (user) {
                                if (user.token_type == constant_1.default.app.TOKEN_TYPE.refresh_token &&
                                    constant_1.default.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
                                    req.logged_in_user = user;
                                    req.token_type = user.token_type;
                                    req.panel_type = user.panel_type;
                                    next();
                                }
                                else if (user.token_type == constant_1.default.app.TOKEN_TYPE.access_token &&
                                    !constant_1.default.app.REFRESH_TOKEN_PATH.includes(req._parsedUrl.path)) {
                                    req.logged_in_user = user;
                                    req.token_type = user.token_type;
                                    req.panel_type = user.panel_type;
                                    next();
                                }
                            }
                            else {
                                const err = new Error(i18n_1.default.__('un_authorized'));
                                err.statusCode = http_status_codes_1.default.UNAUTHORIZED;
                                res.status(yield response_helper_1.default.getStatusCode(err))
                                    .json(yield response_helper_1.default.validationErrorResponse(err));
                                return;
                            }
                        }
                        // if (user) {
                        //     req.logged_in_user = user;
                        // }
                        // next();
                    }))(req, res, next);
                }
            }
        });
    }
    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : Login the user
    * 🗓 Created : 21/4/2022
    */
    loginUser(req, container) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                return yield passport_1.default.authenticate('login', (err, user, info) => {
                    if (err) {
                        container.output.error = {
                            message: err.message,
                            code: err.statusCode
                        };
                        //res.status(err.statusCode).send(err.message);
                    }
                    if (info !== undefined) {
                        container.output.error = {
                            message: info.message,
                            code: http_status_codes_1.default.UNAUTHORIZED
                        };
                    }
                    else {
                        container.derived.user = {};
                        container.derived.user = user;
                    }
                    resolve(container);
                })(req, container);
            }));
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate google auth using passport
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    authenticateGoogle(req, container) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                return passport_1.default.authenticate('google-token', (err, user, info) => {
                    if (err) {
                        container.output.error = {
                            message: err.message,
                            code: err.statusCode
                        };
                        //res.status(err.statusCode).send(err.message);
                    }
                    if (info !== undefined) {
                        container.output.error = {
                            message: info.message,
                            code: http_status_codes_1.default.UNAUTHORIZED
                        };
                    }
                    else {
                        container.derived.user = {};
                        container.derived.user = user ? user.profile._json : null;
                    }
                    resolve(container);
                })(req, container);
            });
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : authenticate facebook auth using passport
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    authenticateFacebook(req, res, container) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                return passport_1.default.authenticate('facebook-token', (err, user, info) => {
                    if (err) {
                        container.output.error = {
                            message: err.message,
                            code: err.statusCode
                        };
                        // res.status(err.statusCode).send(err.message);
                    }
                    if (info !== undefined) {
                        container.output.error = {
                            message: info.message,
                            code: http_status_codes_1.default.UNAUTHORIZED
                        };
                    }
                    else {
                        container.derived.user = {};
                        container.derived.user = user ? user.profile._json : null;
                    }
                    resolve(container);
                })(req, container);
            });
        });
    }
}
exports.default = new PassportAuth();
//# sourceMappingURL=passportAuth.js.map