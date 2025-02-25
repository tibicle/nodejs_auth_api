'use strict'; 
// Import Config
import config from '../../../config/constant';

// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Helpers

// Import validations

// Import Transformers

// Import Libraries

// Import Thirdparty
import moment from 'moment-timezone';
import userRepo from '../repos/user.repo';
import { query } from "express";

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get user profile service
🗓 @created : 25/02/2025
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUser = async (container: any) => { 

    try {

        const {
            input: {
                params,
                query,
                logged_in_user
            },

        } = container;
       
        //
        //  get all the details of user
        //
        container.output.result = await userRepo.getUsersDetails(logged_in_user.uuid);
        
        return container;

    } catch (error) {

        throw error;

    }
}

export default getUser;