"use strict";

// Import Config
import i18n from "../../../config/i18n";
import config from '../../../config/constant';

// Import Helpers
import AuthHelper from "../helper/auth.helper";

// Import Repos
import authRepos from "../repos/auth.repos";
import userRepo from "../../user/repos/user.repo";

// Import permission

// Import Thirdparty
import moment from "moment-timezone";
import randomstring from "randomstring"
import emailHelper from "../../../helpers/email.helper";
 
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Bhavya Nayak
  🚩 @uses : signup Services
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  const signupServices = async (container: any) => {

    try {

      const {
          input: {
          body,
          params
        }
      } = container;

      //
      //  Store hashed password in derived
      //
      await storeHasedPassword(container)
       
      //
      //  Validate user already exist or not
      //
      await validateUser(container)
    
      //
      //  If company is new then insert data in datbase
      //
      await storeDataInDatabase(container)
    
      //
      //  Prepare the Payload for accessToken
      //
      container.output.result.access_token = await AuthHelper.generateAccessToken(container);
          
      //
      //  Prepare the Payload for refreshToken
      //
      container.output.result.refresh_token = await AuthHelper.generateRefreshToken(container);

      //
      //  Save derived user in result for final output
      //
      container.output.result.user = container.derived.user

      return container;

    } catch (error) {
    
       throw error;
    }
  };

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Bhavya Nayak
  🚩 @uses : Service to check valid user
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  const validateUser = async(container:any)=>{

    try {
      const {
        input: {
        body,
        params
        }
      } = container;
      
        //
        //  Get user data by email
        //
        container.derived.user = await userRepo.getUserByEmail(body.email);

        if(container.derived.user){

            const err: any = new Error(i18n.__("user.user_exists"));
            err.statusCode = 400;
            throw err;

        }

      return container;

    } catch (error) {
    
       throw error;
    
    }
  }

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Bhavya Nayak
  🚩 @uses    : Service to store Hashed Password 
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  const storeHasedPassword = async(container:any)=>{
      
    try {

      const {
        input: {
          body,
          params
      },
      derived:{
          password
      }
      } = container;
      
      //
      //  Hash the password of the user while signup
      //
      container.derived.password = await AuthHelper.createHashedPassword(body.password);

    } catch (error) {
    
       throw error
    }
  }
 
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Bhavya Nayak
  🚩 @uses    : Service to store all data in database
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  const storeDataInDatabase = async (container:any)=>{
    try {

      const {
        input: {
          body,
          params
      },
        derived:{
          password
      }
      } = container;

    //
    //  store data in user table 
    //
    await storeDataInUserTable(container)
  

    return container

    } catch (error) {

       throw error;
    }
}

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Bhavya Nayak
  🚩 @uses    : Service to store data in user Table
  🗓 @created : 5/12/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  const storeDataInUserTable = async (container:any)=>{

    try {

      const {
        input: {
          body,
          params
      },
        derived:{
          password
      }
      } = container;

      //
      //  Get user details by email
      //
      container.derived.user = await userRepo.getUserByEmail(body.email)

      if(container.derived.user){

        //
        // store user uuid
        //
        container.derived.userUuid = container.derived.user.uuid

      }else{

        const singupModel = {
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password: password,
          mobile_no: body.mobile_no,
          gender: body.gender,
          created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        };

        //
        //  Insert User details in user table
        //
        container.derived.user = await authRepos.insertUserDetails(singupModel)

        delete container.derived.user.password

        //
        //  Get user details by email
        //
        const data = await userRepo.getUserByEmail(body.email)

        container.derived.userUuid = data.uuid

      }

      return container
        
    } catch (error) {
      
      throw error
    }

}

export default signupServices;
