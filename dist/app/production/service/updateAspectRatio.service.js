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
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Models
const production_repo_1 = __importDefault(require("../repo/production.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update production sequence aspect ratio
🗓 @created : 13/01/2025
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateAspectRatio = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  check sequence uuid is valid or not
        //
        const sequenceDetails = yield production_repo_1.default.getSequenceBySequenceUuid(params.sequence_uuid);
        if (!sequenceDetails) {
            const err = new Error(i18n_1.default.__('production.sequence_not_exists'));
            err.statusCode = 400;
            throw err;
        }
        //
        //  aspect ratio model
        //
        const aspectRatioModel = {
            aspect_ratio: body.aspect_ratio
        };
        //
        //  update aspect ratio column in production sequence table
        //
        yield production_repo_1.default.updateSequence(params.sequence_uuid, aspectRatioModel);
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateAspectRatio;
//# sourceMappingURL=updateAspectRatio.service.js.map