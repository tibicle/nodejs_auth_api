'use strict';
const create_schema = require('../helpers/create_schema');
const { USERS } = require('../constant/schemas.json');
//
//  Basic schema constants
//
const up = async(knex) => {

	//
	// create the schema
	//
	await create_schema(knex, USERS, true);

};

const down = async(knex) => {

	await knex.schema
		.dropSchema(USERS);

};

module.exports = {
	up,
	down,
};