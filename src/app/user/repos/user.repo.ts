// Import Config
import knex from '../../../config/database';
import config from '../../../config/constant';
import i18n from '../../../config/i18n';

// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';

class UserRepo {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get the user by email
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getUserByEmail(email: string) {

        try {

            const [user] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                .whereRaw('LOWER(email) = LOWER(?)', [email])

            return user;

        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to get user by uuid
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getUserByUuid(uuid: string) {

        try {

            const [user] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                .select(
                    'uuid',
                    'first_name',
                    'last_name',
                    'email',
                    'gender',
                    'status',
                    'mobile_no'
                )
                .where('uuid', uuid);

            if (!user) {

                const err: any = new Error(i18n.__('no_user_found'));
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
    👑 @creator : Bhavya Nayak
    🚩 @uses : check email exists or not
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async checkEmail(email: string) {

        try {

            let [user] = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                .whereRaw(`LOWER("email") = ?`, [email.toLowerCase()]);

            if (user) {

                const err: any = new Error(i18n.__('user.user_exists'));
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
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user details by uuid
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getUsersDetails(userUuid: any) {

        try {

            let [userDetails] = await knex(`${config.schema.USERS}.${config.tables.USER} as u`)
                .select('u.uuid', 'u.email', 'u.first_name', 'u.last_name', 'u.mobile_no', 'u.gender')
                .select(knex.raw(`CASE WHEN f.name IS NOT NULL THEN TRIM(CONCAT_WS('/', '${config.app.CLOUDFRONT_URL}', f.name)) ELSE NULL END as file_url`))
                .leftJoin(`${config.schema.MASTERS}.${config.tables.FILE} as f`, 'f.uuid', 'u.file_uuid')
                .groupBy('u.uuid', 'f.name')
                .where('u.uuid', userUuid);

            return userDetails;

        } catch (error) {

            throw error;

        }
    }

    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Bhavya Nayak
   🚩 @uses : get user profile image details by user uuid
   🗓 @created : 25/02/2025
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    async getUserProfileImageByUserUuid(userUuid: any) {

        try {

            const [data] = await knex(`${config.schema.USERS}.${config.tables.USER} as u`)
                .leftJoin(`${config.schema.MASTERS}.${config.tables.FILE} as f`, "f.uuid", "u.file_uuid")
                .select('f.name')
                .where('u.uuid', userUuid)

            return data

        } catch (error) {

            throw error

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update user data
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async updateUserByUuid(uuid: string, updateUserDataModel: any) {

        try {

            const user = await knex(`${config.schema.USERS}.${config.tables.USER}`)
                .update(updateUserDataModel)
                .where('uuid', uuid)
                .returning('*');

            return user;

        }
        catch (error) {

            throw error;

        }
    }

}

export default new UserRepo();