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
Object.defineProperty(exports, "__esModule", { value: true });
// Import Thirdparty
class SizeConverter {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : convert bytes into required format
    🗓 @created : 05/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    convertBytes(bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var marker = 1024; // Change to 1000 if required
                var decimal = 3; // Change as required
                var kiloBytes = marker; // One Kilobyte is 1024 bytes
                var megaBytes = marker * marker; // One MB is 1024 KB
                var gigaBytes = marker * marker * marker; // One GB is 1024 MB
                // return bytes if less than a KB
                if (bytes < kiloBytes)
                    return bytes + " Bytes";
                // return KB if less than a MB
                else if (bytes < megaBytes)
                    return (bytes / kiloBytes).toFixed(decimal) + " KB";
                // return MB if less than a GB
                else if (bytes < gigaBytes)
                    return (bytes / megaBytes).toFixed(decimal) + " MB";
                // return GB if less than a TB
                else
                    return (bytes / gigaBytes).toFixed(decimal) + " GB";
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SizeConverter();
//# sourceMappingURL=covertBytesToSize.helper.js.map