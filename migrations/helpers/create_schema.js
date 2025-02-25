'use strict';

//
//  Create schema query builder
//  
const create_schema = async (knex, schema_name, is_exist_check = false) => {

    try {

        const query = await knex.raw(`CREATE SCHEMA ${is_exist_check ? 'IF NOT EXISTS' : ''} ${schema_name}`);

        return true;

    } catch (error) {

        throw error;

    }

};

//
//  Export these function
//
module.exports = create_schema;