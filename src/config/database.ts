import { knex } from 'knex';
let dbConfig = require('../../knexfile.js');
export default knex(dbConfig);