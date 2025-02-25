// Import Config
import knex from '../../../config/database';
import config from '../../../config/constant';


// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

class authRepo{
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : store signup details in database
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */ 
  async insertUserDetails(data:any){
    
    try {

        const [userData] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .insert(data)
                    .returning('*')

        return userData;
     
    }catch (error) {
       
        throw error

    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : store signup details in database
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async insertCompanyDetails(data:any) {

      try {

        const [companyData] = await knex(`${config.schema.USERS}.${config.tables.COMPANY}`)
                  .insert(data)
                  .returning('*')

        return companyData
      
      }
      catch (error) {

        throw error;
      }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Insert details in user_company table 
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async insertUserCompanyDetails(data:any){
    
      try {

        await knex(`${config.schema.USERS}.${config.tables.USER_COMPANY}`).insert(data)
     
      } 
      catch (error) {
       
        throw error

    }
  }
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Get role details of owner
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async getRoleData(){
    
    try {
   
      const [roleData] = await knex(`${config.schema.USERS}.${config.tables.ROLE}`).where('code', config.system_roles.USER)

      return roleData
  
    }catch (error) {
    
      throw error;
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Insert role details of owner in user_role table
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async insertUserRoleDetails(data:any){
     
    try {

      await knex(`${config.schema.USERS}.${config.tables.USER_ROLE}`).insert(data)
   
    } catch (error) {
     
      throw error

    }
  }

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : save random code to the database hashpassword column and expiry time
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async saveRandomCode(container:any){
      
    try {

      const {
        input: {
            params,
            query,
            body
        },
        derived:{
          user,
          randomCode,
          expiryTime
        }

      } = container;
  
      const saveHashPassword = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                    .where('email', user.email)
                                    .update({'reset_hash': randomCode });

      const saveExpiryTime = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                  .where('email', user.email)
                                  .update({'expiry_time': expiryTime});

      return [saveHashPassword,saveExpiryTime]
      
    } catch (error) {
         
      throw error
  
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Get Expiry time of the user
  🗓 @created : 24/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async getExpiryTime(code:string){
    
    try {
   
      const [expiryTime] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                   .where('reset_hash',code)
  
      return expiryTime
  
    }
    catch (error) {
   
      throw error;
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Save updated user password in database
  🗓 @created : 24/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async updatePassword(container:any){
    
    try {

      const {
        input: {
            params,
            query,
            body
        },
        derived:{
            user,
            password
        }
      } = container;
   
     return await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .where('reset_hash',body.code)
                    .update('password',password)
     
    }
    catch (error) {
   
      throw error;
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : updated hash password and expiry time to null
  🗓 @created : 24/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async updateHashPasswordExpiryTime(container:any){
    
    try {

      const {
        input: {
            params,
            query,
            body
        },
        derived:{
            user,
            password
        }
      } = container;
   
      return await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .where('reset_hash',body.code)
                    .update('reset_hash',null)
                    .update('expiry_time',null)
                                    
   }
    catch (error) {
   
      throw error;
    }
  }

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : change user new password in database
  🗓 @created : 9/11/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async changePassword(uuid:any,newPassword:string){
    
    try {
   
      return await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .where('uuid',uuid)
                    .update('password',newPassword)     
                                                    
   }
    catch (error) {
   
      throw error;
    }
  }

  /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : to get user password by uuid
    🗓 @created : 15/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getUserPassword(uuid: string) {

      try {
          
          const [user] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                .select('password')
                                .where('uuid',uuid);

          if(!user) {
              
              const err:any = new Error(i18n.__('no_user_found'));
              err.statusCode = 400;
              throw err;
              
          } 

          return user;

      } catch (error) {

          throw error;

      }

  }

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : update is verify email status to true
  🗓 @created : 09/09/2024
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async updateVerifyEmailStatus(container:any){
    
    try {

      const {
        input: {
            params,
            query,
            body
        },
        derived:{
            user,
            password
        }
      } = container;
   
     return await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .where('reset_hash',body.code)
                    .update('is_email_verified',true)
     
    }
    catch (error) {
   
      throw error;
    }
  }

   /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : updated reset hash and expiry time to null
  🗓 @created : 09/09/2024
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async updateResetHashAndExpiryTime(container:any){
    
    try {

      const {
        input: {
            params,
            query,
            body
        },
        derived:{
            user,
            password
        }
      } = container;
   
      return await knex(`${config.schema.USERS}.${config.tables.USER}`)
                    .where('reset_hash',body.code)
                    .update('reset_hash',null)
                    .update('expiry_time',null)
                                    
   }
    catch (error) {
   
      throw error;
    }
  }

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Get role details of owner
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async getOwnerRoleData(){
    
    try {
   
      const [roleData] = await knex(`${config.schema.USERS}.${config.tables.ROLE}`).where('code', config.system_roles.OWNER)

      return roleData
  
    }catch (error) {
    
      throw error;
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : Get Expiry time by 
  🗓 @created : 24/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async getResetHashByEmail(email:string){
    
    try {
   
      const [userData]=await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                   .where('email',email)
  
      return userData
  
    }
    catch (error) {
   
      throw error;
    }
  } 

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  👑 @creator : Sushant Shekhar
  🚩 @uses : save random code to the database hashpassword column and expiry time
  🗓 @created : 17/10/2023
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  async saveResendRandomCode(resendCodeModel:any,email:any){
      
    try {
  
      const saveHashPassword=await knex(`${config.schema.USERS}.${config.tables.USER}`)
                                    .update(resendCodeModel)
                                    .where('email', email)

      return saveHashPassword
      
    } catch (error) {
         
      throw error
  
    }
  }
}

export default new authRepo();