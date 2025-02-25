const file = require("./0.0.1/file");
const create_master_schema = require("./0.0.1/create_master_schema");

exports.up = async(knex) => {

    try {

        //
        //  create the master schema
        //
        await create_master_schema.up(knex);
        
        //
        //  create file table
        //
        await file.up(knex);

    } catch (error) {

        throw error;

    }
};

exports.down = async(knex) => {

    try {

        //
        //  down file table
        //
        await file.down(knex);

        //
        //  create the master schema
        //
        await create_master_schema.up(knex);

    } catch (error) {

        throw error;

    }

};