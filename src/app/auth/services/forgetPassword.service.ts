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
import generator from "generate-password";
import emailHelper from "../../../helpers/email.helper";
import authRepos from "../repos/auth.repos";
import randomstring from "randomstring"
import moment from "moment-timezone";

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : forget user password service
🗓 @created : 23/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const forgetUserPassword = async (container: any) => { 

	try {

        const {
            input: {
                params,
                query,
                body
            },

        } = container;

        //
        //  check user exists or not by email
        //
        container.derived.user = await userRepo.getUserByEmail(body.email);

		//
		//  generate random code and expiry time
		//
        await generateRandomCode(container)
        
        //
        //save random 16 digit code to the user database and 10 minute expiry time
        //
        await authRepos.saveRandomCode(container);

        container.output.result.code = container.derived.randomCode

		return container;

	} catch (error) {

		throw error;

	}

};

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : generate new 16 digit random code and save to database
🗓 @created : 19/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const generateRandomCode = async (container:any) => { 

	try {

        const {
            input: {
                params,
                query,
                body
            },

        } = container;

		//
        //generate random 16 digit code 
        //
        container.derived.randomCode = randomstring.generate(16);

        //
        //set expiry time of 10 min
        //
        container.derived.expiryTime =  moment.utc().add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
        
		return container;

	} catch (error) {

		throw error;

	}

};

export default forgetUserPassword;
