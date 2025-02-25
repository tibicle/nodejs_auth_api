// Import Config
import config from '../../../config/constant'

// Import Static

// Import Helpers

// Import Transformers

// Import Libraries

// Import repos

// Import Thirdparty
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class AuthHelper {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : create hashed password
    🗓 @created : 16/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async createHashedPassword(password: string) {
      
        try {
    
            //
            //create hashed password 
            //
            const hashedPassword = await hash(password, 10);

            return hashedPassword;

        } catch (error) {
            
            throw error;

       }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : compare password
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async comparePassword(password: string, user_password: string) {

        try {

            return bcrypt.compare(password, user_password).then(response => {
                if (response !== true) {
                  return false;
                }
                  return true;
            });

        } catch (error) {

            throw error;

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate access token
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateAccessToken(container: any) {

        try {

            const {
                input: {
                body,
                params
              }
            } = container;

            //
            //generate access_token and refresh_token
            //
            const payload: any = {
                user_uuid: container.input.logged_in_user ? container.input.logged_in_user.uuid : container.derived.user.uuid,
                roles: container.input.logged_in_user ? container.input.logged_in_user.roles : container.derived.user_roles,
                type: config.app.TOKEN_TYPE.access_token,
                panel_type: container.input.logged_in_user ? container.input.logged_in_user.panel_type : null
            }

            const secretKey: any = config.app.JWT_SECRET_KEY;
            const access_token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

            return access_token;

        } catch (error) {
            throw error;
        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate refresh token 
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateRefreshToken(container: any) {

        const {
            input: {
            body,
            params
          }
        } = container;

        //
        //generate access_token and refresh_token
        //
        const payload: any = {
            user_uuid: container.input.logged_in_user ? container.input.logged_in_user.uuid : container.derived.user.uuid,
            roles: container.input.logged_in_user ? container.input.logged_in_user.roles : container.derived.user_roles,
            type: config.app.TOKEN_TYPE.refresh_token,
            panel_type: container.input.logged_in_user ? container.input.logged_in_user.panel_type : null
        }

        const secretKey: any = config.app.JWT_SECRET_KEY;

        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
        return token;

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate hash password
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateHashPassword(password: string) {

        try {

            const hashPass = await bcrypt.hash(password, 10);

            return hashPass;


        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate forgot password link
    🗓 @created : 14/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateForgotPasswordToken() {

        try {

            return crypto.randomBytes(10).toString('hex');

        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate six digit OTP
    🗓 @created : 26/07/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateOtp() {

        try {

            const randomBytes = crypto.randomBytes(2);
            const decimalValue = parseInt(randomBytes.toString('hex'), 16);
            const otp = (decimalValue % 10000).toString().padStart(4, '0');

            return otp;

        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : generate six digit random hash code
    🗓 @created : 27/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async generateSixDigitRandomHashCode() {

        try {

            return crypto.randomBytes(3).toString('hex');

        } catch (error) {

            throw error;

        }

    }
}

export default new AuthHelper();