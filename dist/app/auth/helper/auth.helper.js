"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Helpers
// Import Transformers
// Import Libraries
// Import repos
const userRole_repo_1 = __importDefault(require("../../user/repos/userRole.repo"));
// Import Thirdparty
const bcrypt_1 = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class AuthHelper {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : create hashed password
    🗓 @created : 16/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    createHashedPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                //create hashed password 
                //
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                return hashedPassword;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : compare password
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    comparePassword(password, user_password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return bcrypt_1.default.compare(password, user_password).then(response => {
                    if (response !== true) {
                        return false;
                    }
                    return true;
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate access token
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateAccessToken(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, params } } = container;
                //
                // get the user role
                //
                if (container.derived.user) {
                    const role = yield userRole_repo_1.default.getRoleByUserUuid(container.derived.user.uuid);
                    container.derived.user_roles = role.map((r) => r.code);
                }
                //
                //generate access_token and refresh_token
                //
                const payload = {
                    user_uuid: container.input.logged_in_user ? container.input.logged_in_user.uuid : container.derived.user.uuid,
                    roles: container.input.logged_in_user ? container.input.logged_in_user.roles : container.derived.user_roles,
                    type: constant_1.default.app.TOKEN_TYPE.access_token,
                    panel_type: container.input.logged_in_user ? container.input.logged_in_user.panel_type : null
                };
                const secretKey = constant_1.default.app.JWT_SECRET_KEY;
                const access_token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '24h' });
                return access_token;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate refresh token
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateRefreshToken(container) {
        return __awaiter(this, void 0, void 0, function* () {
            const { input: { body, params } } = container;
            //
            // get the user role
            //
            if (container.derived.user) {
                const role = yield userRole_repo_1.default.getRoleByUserUuid(container.derived.user.uuid);
                container.derived.user_roles = role.map((r) => r.code);
            }
            //
            //generate access_token and refresh_token
            //
            const payload = {
                user_uuid: container.input.logged_in_user ? container.input.logged_in_user.uuid : container.derived.user.uuid,
                roles: container.input.logged_in_user ? container.input.logged_in_user.roles : container.derived.user_roles,
                type: constant_1.default.app.TOKEN_TYPE.refresh_token,
                panel_type: container.input.logged_in_user ? container.input.logged_in_user.panel_type : null
            };
            const secretKey = constant_1.default.app.JWT_SECRET_KEY;
            const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '7d' });
            return token;
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate hash password
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateHashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPass = yield bcrypt_1.default.hash(password, 10);
                return hashPass;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate forgot password link
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateForgotPasswordToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return crypto_1.default.randomBytes(10).toString('hex');
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate six digit OTP
    🗓 @created : 26/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateOtp() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomBytes = crypto_1.default.randomBytes(2);
                const decimalValue = parseInt(randomBytes.toString('hex'), 16);
                const otp = (decimalValue % 10000).toString().padStart(4, '0');
                return otp;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate six digit random hash code
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    generateSixDigitRandomHashCode() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return crypto_1.default.randomBytes(3).toString('hex');
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new AuthHelper();
//# sourceMappingURL=auth.helper.js.map