"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knex = void 0;
// Import Config
const constant_1 = __importDefault(require("./constant"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const { setTypeParser, builtins } = require('pg').types;
var Knex;
(function (Knex) {
    setTypeParser(builtins.DATE, (val) => (0, moment_timezone_1.default)(val).format('YYYY-MM-DD'));
    // setTypeParser(builtins.TIME, (val:any) => moment(val).format('HH:mm:ss'));
    let dbConfigEnv = {
        client: 'postgresql',
        connection: {
            host: constant_1.default.app.DB_HOST,
            database: constant_1.default.app.DB_NAME,
            user: constant_1.default.app.DB_USERNAME,
            password: constant_1.default.app.DB_PASSWORD,
            port: constant_1.default.app.DB_PORT,
            charset: 'utf8mb4',
            dateStrings: true,
            // typeCast: function (field:any, next:NextFunction) {
            //   console.log(field);
            //   console.log(`here in dbConfig`);
            //   if (field.type == 'DATETIME') {
            //     if(field.string()) {
            //       console.log(field.string());
            //       return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
            //     }
            //   }
            //   return next();
            // }
            // typeCast: function(field:any, next:NextFunction) {
            //     if (field.type == 'JSON') {
            //         return (JSON.parse(field.string()));
            //     }
            //     return next();
            // }
        },
        pool: {
            min: 10,
            max: 100,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations/',
            disableMigrationsListValidation: true
        },
    };
    if (constant_1.default.app.ENVIRONMENT = "production") {
        dbConfigEnv['connection']['ssl'] = {
            rejectUnauthorized: false
        };
    }
    Knex.dbConfig = dbConfigEnv;
})(Knex || (exports.Knex = Knex = {}));
exports.default = { Knex };
//# sourceMappingURL=knexConfig.js.map