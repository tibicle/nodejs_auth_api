"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
let dbConfig = require('../../knexfile.js');
exports.default = (0, knex_1.knex)(dbConfig);
//# sourceMappingURL=database.js.map