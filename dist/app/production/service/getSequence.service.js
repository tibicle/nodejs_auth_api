// "use strict"; 
// // Import Config
// import i18n from "../../../config/i18n";
// import config from "../../../config/constant";
// // Import Static
// // Import Middleware
// // Import Controllers
// // Import Interface
// // Import Helpers
// // Import validations
// // Import Transformers
// // Import Libraries
// // Import Models
// import productionRepo from "../repo/production.repo";
// // Import Thirdparty
// import statusCodes from "http-status-codes";
// import moment from "moment-timezone";
// /*
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 👑 @creator : Bhavya Nayak
// 🚩 @uses : get production sequence service 
// 🗓 @created : 13/03/2024
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// */
// const getSequence = async (container: any) => { 
// 	try {
//         const {
//             input: {
//                 body,
//                 params,
//                 query
//             }
//         } = container;
//         //
//         //  check production exists or not 
//         //
//         await productionRepo.checkProductionByUuid(params.production_uuid)
// 		//
//         //  get sequence by production uuid
//         //
//         const sequence = await productionRepo.getSequenceByProductionUuid(params.production_uuid)
//         container.output.result = sequence;
// 		return container;
// 	} catch (error) {
// 		throw error;
// 	}
// };
// export default getSequence;
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
//  Import Repo
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get production data service
🗓 @created : 03/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getSequence = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { logged_in_user, params } } = container;
        //
        // Add the pagination data
        //
        let isPagination = false;
        container.output.meta = {};
        if (container.input.query && ('page' in container.input.query)) {
            container.output.meta.total_rows = yield production_repo_1.default.getAllSequenceByProductionUuid(container, 'CountTotalData');
            container.output.meta.per_page = parseInt(container.input.query.per_page) || 10;
            container.output.meta.page = parseInt(container.input.query.page);
            isPagination = true;
        }
        if ((container.output.meta.total_rows > 0 && isPagination) || !isPagination) {
            //
            // Get the library data
            //
            container.output.result = yield production_repo_1.default.getAllSequenceByProductionUuid(container, 'productionSequence');
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
exports.default = getSequence;
//# sourceMappingURL=getSequence.service.js.map