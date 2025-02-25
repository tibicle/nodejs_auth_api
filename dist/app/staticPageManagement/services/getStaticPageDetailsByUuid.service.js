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
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const staticPage_repo_1 = __importDefault(require("../repos/staticPage.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get static page details by uuid service
🗓 @created : 04/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getStaticPageDetailsByUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check static page exists or not and send the response
        //
        const staticPageData = yield staticPage_repo_1.default.checkStaticPageByUuid(params.uuid);
        //
        //  get static page details
        //
        container.output.result = staticPageData;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getStaticPageDetailsByUuid;
//# sourceMappingURL=getStaticPageDetailsByUuid.service.js.map