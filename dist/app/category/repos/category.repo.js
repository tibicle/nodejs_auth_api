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
// Import Config
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
class CategoryRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : get total category data
    🗓 @created : 7/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getAllCategoryData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = yield (0, database_1.default)(`${constant_1.default.schema.MASTERS}.${constant_1.default.tables.CATEGORY}`)
                    .select('uuid', 'title');
                return categoryData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new CategoryRepo();
//# sourceMappingURL=category.repo.js.map