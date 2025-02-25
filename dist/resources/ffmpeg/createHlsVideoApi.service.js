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
// Import Config
const hlsVideoCreate_service_1 = __importDefault(require("./hlsVideoCreate.service"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : create hls video by api call
🗓 @created : 04/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const createHlsVideoApiService = (exportPath, exportFolder, exportUuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  hls video create service call
        //
        yield (0, hlsVideoCreate_service_1.default)(exportPath, exportFolder, exportUuid);
    }
    catch (error) {
        throw error;
    }
});
exports.default = createHlsVideoApiService;
//# sourceMappingURL=createHlsVideoApi.service.js.map