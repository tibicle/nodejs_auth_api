const create_user = require('./0.0.3/create_user');

exports.up = async(knex) => {

    try {

        //
        //  create user table
        //
        await create_user.up(knex);

    } catch (error) {

        throw error;

    }
};

exports.down = async(knex) => {

    try {

        //
        // down user table
        //
        await create_user.down(knex);

    } catch (error) {

        throw error;

    }

};