"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
class CountryRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Ekta Patel
    🚩 @uses : Get country data (all or partial based on input)
    🗓 @created : 04/11/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listCountries(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { query } } = container;
                let CountryQuery = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.COUNTRY} as co`);
                if (!query.dropdown) {
                    CountryQuery.select('co.uuid', 'co.country_iso', 'co.country_iso3', 'co.calling_code', 'co.name');
                }
                else {
                    CountryQuery.select('co.uuid', 'co.name');
                }
                if (query.per_page &&
                    query.page) {
                    CountryQuery.limit(query.per_page || constant_1.default.app.PER_PAGE);
                    CountryQuery.offset((query.page - 1) * query.per_page);
                }
                return yield CountryQuery;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       👑 @creator : Ekta Patel
       🚩 @uses : Get country data
       🗓 @created : 05/11/2024
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    getTotalCountries(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let totalCountries = (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.COUNTRY} as co`)
                    .count('co.uuid as total_results');
                const [results] = yield totalCountries;
                if (results) {
                    return parseInt(results.total_results);
                }
                else {
                    return 0;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new CountryRepo();
//# sourceMappingURL=country.repos.js.map