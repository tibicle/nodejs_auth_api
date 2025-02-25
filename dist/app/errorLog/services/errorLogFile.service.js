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
const fs_1 = __importDefault(require("fs"));
const fs1 = require('fs').promises;
const path_1 = __importDefault(require("path"));
const errorLog_repo_1 = __importDefault(require("../repos/errorLog.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : download error file
🗓 @created : 18/03/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const errorLogFile = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  get the error details 
        //
        const errorDetails = yield errorLog_repo_1.default.getErrorDetailsByUuid(params.uuid);
        //
        //  convert data into JSON stringify
        //
        const jsonDataString = JSON.stringify(errorDetails.error_log, null, 2);
        //
        //  check for the output path
        //
        const outputPath = path_1.default.join(__dirname, '../../../../assets/errorLog');
        const outputFolderPath = path_1.default.join(__dirname, '../../../../assets/errorLog');
        yield checkFolder(outputFolderPath);
        const outputFilePath = `${outputPath}/error__log_file_${Date.now()}.json`;
        //
        //  download the JSON file into local asset folder
        //
        yield fs_1.default.promises.writeFile(outputFilePath, jsonDataString);
        //
        //  store the result into container
        //
        container.output.result = outputFilePath;
        return container;
    }
    catch (error) {
        throw error;
    }
});
const checkFolder = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs1.access(path, fs_1.default.constants.F_OK);
    }
    catch (error) {
        yield fs1.mkdir(path, { recursive: true });
    }
});
exports.default = errorLogFile;
//# sourceMappingURL=errorLogFile.service.js.map