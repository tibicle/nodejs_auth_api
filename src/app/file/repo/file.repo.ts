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


class fileRepo {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save file
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async saveFileData(FileModelData: any) {

        try {

            const fileUuid = await knex(`${config.schema.MASTERS}.${config.tables.FILE}`)
                .insert(FileModelData)
                .returning('uuid');

            return fileUuid;

        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to check is file saved or not
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async checkFile(uuid: string) {

        try {

            const [file] = await knex(`${config.schema.MASTERS}.${config.tables.FILE}`)
                .where('uuid', uuid)

            if (!file) {
                const err: any = new Error(i18n.__('no_file_found'));
                err.statusCode = 400;
                throw err;
            }
            return file;

        } catch (error) {

            throw error;

        }

    }


    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update reference details
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async updateFiledata(uuid: string, fileModelData: any) {

        try {

            return await knex(`${config.schema.MASTERS}.${config.tables.FILE}`)
                .where('uuid', uuid)
                .update(fileModelData);

        } catch (error) {

            throw error;

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check file by name 
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async checkFileByName(name: string) {

        try {

            const [file] = await knex(`${config.schema.MASTERS}.${config.tables.FILE}`)
                .where('name', name)

            return file;

        } catch (error) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get file by uuid 
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getFileByUuid(uuid: string) {

        try {

            const [file] = await knex(`${config.schema.MASTERS}.${config.tables.FILE}`)
                .where('uuid', uuid)

            return file;

        } catch (error) {

            throw error;

        }

    }

}


export default new fileRepo();
