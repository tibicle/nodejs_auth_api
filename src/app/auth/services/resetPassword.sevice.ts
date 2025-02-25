// Import Config
import i18n from "../../../config/i18n";
import config from '../../../config/constant'

// Import Static

// Import Middleware
import passportAuth from '../../../middleware/passportAuth';
import authorization from '../../../middleware/authorization';

// Import services
import AuthHelper from '../helper/auth.helper';

// Import Helpers
import responseHelper from '../../../helpers/response.helper';

// Import Repos
import userRepo from '../../user/repos/user.repo';

// Import Transformers

// Import Libraries

// Import Thirdparty
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authRepos from "../repos/auth.repos";
import moment from "moment-timezone";

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : reset user password service
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const resetUserPassword = async (container: any) => { 

	try {

        const {
            input: {
                params,
                query,
                body
            },

        } = container;

        //
        //  check user reset_hash and expiry time is valid or not
        //
        await validateExpiryTime(container);

        //
        //  update user password
        //
        await updatePassword(container)
	
		return container;

	} catch (error) {

		throw error;

	}

};

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate expiry time 
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateExpiryTime = async (container: any) => { 

	try {

        const {
            input: {
                params,
                query,
                body
            },

        } = container;

        //
        //get user Expiry time from database and match with current time by using code from body
        //
        const userExpiryTime = await authRepos.getExpiryTime(body.code)
       
        //
        //get current time 
        //
        const currentTime= moment.utc().format("YYYY-MM-DD HH:mm:ss");

        if(!userExpiryTime){

            const err: any = new Error(i18n.__("auth.code_invalid"));
            err.statusCode = 400;
            throw err;
     
        }else if(moment(currentTime) > moment(userExpiryTime.expiry_time)){

            const err: any = new Error(i18n.__("auth.time_expired"));
            err.statusCode = 400;
            throw err;
        }

        container.derived.user = userExpiryTime
		
		return container;

	} catch (error) {

		throw error;

	}

};

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update user new password and save to database
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updatePassword = async (container: any) => { 

	try {

        const {
            input: {
                params,
                query,
                body
            },
            derived:{
                user
            }

        } = container;
        
		//
        //convert user password in hashed password
        //
        container.derived.password = await AuthHelper.createHashedPassword(body.password);

        //
        //save updated user password in database
        //
        await authRepos.updatePassword(container)

        //
        //update reset_hash and expiry time to null
        //
        await authRepos.updateHashPasswordExpiryTime(container)

        container.output.message = i18n.__('auth.password_changed_successfully');

		return container;

	} catch (error) {

		throw error;

	}

};

export default resetUserPassword;
