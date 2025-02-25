    // Import Config
    import config from './constant';

    // Import Static
    
    // Import Middleware
    
    // Import Controllers
    
    // Import Interface
    
    // Import Validators
    
    // Import Helpers
    
    // Import Transformers
    
    // Import Libraries
    
    // Import Models
    
    // Import Thirdparty
    import { NextFunction } from 'express';
    import moment from 'moment-timezone';
    
    const { setTypeParser, builtins } = require('pg').types;
    
    export namespace Knex {
    
        
        setTypeParser(builtins.DATE, (val:any) => moment(val).format('YYYY-MM-DD'));
        // setTypeParser(builtins.TIME, (val:any) => moment(val).format('HH:mm:ss'));
      let dbConfigEnv : any = {
        client: 'postgresql',
        connection: {
          host: config.app.DB_HOST,
          database: config.app.DB_NAME,
          user: config.app.DB_USERNAME,
          password: config.app.DB_PASSWORD,
          port: config.app.DB_PORT,
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
          disableMigrationsListValidation:true
        },

      }
      if(config.app.ENVIRONMENT = "production") {
        dbConfigEnv['connection']['ssl'] = {
          rejectUnauthorized : false
        }
      }

        export const dbConfig : any = dbConfigEnv;
    }
    
export default { Knex }

