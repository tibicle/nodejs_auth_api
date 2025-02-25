// Import Config
import i18n from "../../../config/i18n";
import config from '../../../config/constant'

// Import Static

// Import Middleware

// Import services

// Import Helpers
import authHelper from "../helper/auth.helper";

// Import Repos
import authRepos from "../repos/auth.repos";

// Import Transformers

// Import Libraries

// Import Thirdparty
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import generator from "generate-password";
import moment from "moment-timezone";

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : change password service
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const changePasswordService = async (container: any) => { 

	try {

        const {
            input: {
                params,
                query,
                body,
                logged_in_user
            },

        } = container;

        //
        //  check old password is related to logged in user
        //
        await checkOldPassword(container)

        //
        //  covert password in hased password
        //
        await convertToHashedPassword(container)

        //
        //  store changed password in user database
        //
        await storeNewPassword(container)

		return container;

	} catch (error) {

		throw error;

	}

};

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check old password is matched or not with logged in user
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkOldPassword = async (container:any)=>{

    try {

        const {
            input: {
                params,
                query,
                body,
                logged_in_user
            },

        } = container;

        //
        //  get user detials by logged in user uuid
        //
        const userPassword = await authRepos.getUserPassword(logged_in_user.uuid)

        //
        //  compare old password with the stored password
        //
        const comparePassword = await authHelper.comparePassword(body.old_password,userPassword.password)

        if(!comparePassword){

            const err: any = new Error(i18n.__("auth.old_password_not_matched"));
            err.statusCode = 400;
            throw err; 

        }

        return container
        
    } catch (error) {

        throw error
        
    }

}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : convert new password in hashed password
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const convertToHashedPassword = async (container:any)=>{

    try {

        const {
            input: {
                params,
                query,
                body,
                logged_in_user
            }
        } = container;

        //
        // convert new password in hased password
        //
        container.derived.newHashedPassword = await authHelper.createHashedPassword(body.password)

        return container
        
    } catch (error) {

        throw error
        
    }

}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check old password is matched or not with logged in user
🗓 @created : 9/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeNewPassword = async (container:any)=>{

    try {

        const {
            input: {
                params,
                query,
                body,
                logged_in_user
            },
            derived:{
                newHashedPassword  
            }

        } = container;

        //
        //  store new password in database
        //
        await authRepos.changePassword(logged_in_user.uuid,newHashedPassword)
        
        container.output.message = i18n.__('auth.password_changed_successfully');
        
        return container
        
    } catch (error) {

        throw error
        
    }

}

export default changePasswordService;
