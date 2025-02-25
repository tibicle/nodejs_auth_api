'use strict';
const {USERS} = require('../constant/schemas.json');
const { USER } = require('../constant/tables.json');
const { gender } = require('../constant/constant.json')

//
//  Basic schema constants
//
const up = async(knex) => {

	await knex.schema.withSchema(USERS).createTable(USER, (table) => {

		table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('email',100).notNullable();
		table.string('password',254).nullable();
		table.string('first_name',254).nullable();
		table.string('last_name',254).nullable();
		table.enu('gender',[...Object.values(gender)]).nullable();
		table.date('date_of_birth').nullable();
		table.bool('is_reset_on').notNullable().defaultTo(1);
		table.enu('status',['ACTIVE','DEACTIVE']).notNullable().defaultTo('ACTIVE');
		table.uuid('file_uuid').nullable();
		table.varchar('mobile_no',20).nullable();
        table.string('google_id', 100).nullable();
		table.string('facebook_id',100).nullable();
		table.string('apple_id',100).nullable();
		table.string('reset_hash').nullable()
        table.datetime('expiry_time').nullable()
		table.datetime('created_at').notNullable();
		table.uuid('created_by').nullable();
		table.datetime('updated_at').nullable();
		table.uuid('updated_by').nullable();

	});

};

const down = async(knex) => {

	await knex.schema
		.dropTable(`${USERS}.${USER}`);

};

module.exports = {
	up,
	down,
};