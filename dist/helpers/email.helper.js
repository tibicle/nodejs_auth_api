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
const email_templates_1 = __importDefault(require("email-templates"));
class EmailHelper {
    //
    // get the html 
    //
    ejsToHtml(templateName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            //  Convert template to html string
            //
            const email = new email_templates_1.default({
                views: {
                    options: {
                        extension: 'ejs',
                    },
                },
            });
            //
            //  Pass dynamic variables to template
            //
            const html = email.render(templateName, data);
            return html;
        });
    }
}
exports.default = new EmailHelper();
//# sourceMappingURL=email.helper.js.map