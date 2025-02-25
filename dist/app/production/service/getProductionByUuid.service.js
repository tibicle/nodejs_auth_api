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
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get production by uuid service
🗓 @created : 1/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getProductionByUuidService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        container.derived.tagData = [];
        //
        // check production data
        //
        container.production = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        // get production data except tag_uuid
        //
        container.derived.production = yield production_repo_1.default.getProductionByUuid(params.production_uuid);
        container.output.result = container.derived.production;
        //
        // get tag name by using tag_uuid
        //
        // await getTagName(container)
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get tag name by tag uuid
🗓 @created : 02/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getTagName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        for (let i = 0; i < container.production.tag_uuid.length; i++) {
            //
            // store the tag name with uuid
            //
            const tagDetail = yield production_repo_1.default.getTagNameByUuid(container.production.tag_uuid[i]);
            container.derived.tagData.push(tagDetail);
        }
        // container.output.result.tag = container.derived.tagData;
        return container;
    }
    catch (error) {
    }
});
exports.default = getProductionByUuidService;
//# sourceMappingURL=getProductionByUuid.service.js.map