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
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Models
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save production media
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveProductionMedia = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        // check production exists or not
        //
        yield production_repo_1.default.checkProductionByUuid(body.production_uuid);
        //
        //  check library uuid exists or not
        //
        yield library_repo_1.default.checkLibrary(body.library_uuid);
        //
        //  save production media
        //
        yield addProductionMedia(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : add prodution media
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addProductionMedia = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  get production media 
        //
        const productionMedia = yield production_repo_1.default.getProductionMediaByUuid(body.production_uuid);
        const libraryUuid = [];
        if (body.library_uuid) {
            body.library_uuid.map((uuid) => {
                if (!productionMedia.map((data) => data.library_uuid).includes(uuid)) {
                    libraryUuid.push({
                        production_uuid: body.production_uuid,
                        library_uuid: uuid,
                        created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                    });
                }
            });
        }
        if (libraryUuid && libraryUuid.length > 0) {
            //
            //  insert production media
            //
            yield production_repo_1.default.saveProductionMedia(libraryUuid);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveProductionMedia;
//# sourceMappingURL=saveProductionMedia.service.js.map