const create_user_schema = require('./0.0.2/create_user_schema');

exports.up = async(knex) => {

    try {

        
        //
        //  create the user schema
        //
        await create_user_schema.up(knex);

    } catch (error) {

        throw error;

    }
};

exports.down = async(knex) => {

    try {

        //
        //  down user schema
        //
        await create_user_schema.down(knex);

    } catch (error) {

        throw error;

    }

};