'use strict';
const {MASTERS} = require('../constant/schemas.json');
const { FILE } = require('../constant/tables.json');
//
//  Basic schema constants
//
const up = async(knex) => {

	await knex.schema.withSchema(MASTERS).createTable(FILE, (table) => {

		table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('ref_uuid').nullable(),
        table.string('ref_type').nullable(),
        table.string('name').nullable(),
        table.string('content_type').nullable(),
        table.text('aws_s3_url').nullable(),
		table.datetime('created_at').notNullable();
		table.datetime('updated_at').nullable();
	});

};

const down = async(knex) => {

	await knex.schema
		.dropTable(`${MASTERS}.${FILE}`);

};

module.exports = {
	up,
	down,
};