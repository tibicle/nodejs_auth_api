'use strict';
const create_schema = require('../helpers/create_schema');
const { MASTERS } = require('../constant/schemas.json');
//
//  Basic schema constants
//
const up = async(knex) => {

	//
	// create the schema
	//
	await create_schema(knex, MASTERS, true);

};

const down = async(knex) => {

	await knex.schema
		.dropSchema(MASTERS);

};

module.exports = {
	up,
	down,
};