'use strict';
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
// Import Libraries
// Import services
// Import Repo
const country_repos_1 = __importDefault(require("../repos/country.repos"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Ekta Patel
🚩 @uses : get country details
🗓 @created : 04/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const listCountry = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield country_repos_1.default.getTotalCountries(container);
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the Country data
            //
            container.output.result = yield country_repos_1.default.listCountries(container);
        }
        else {
            container.output.result = [];
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = listCountry;
//# sourceMappingURL=country.service.js.map