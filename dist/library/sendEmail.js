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
const brevo_1 = __importDefault(require("../config/brevo"));
const sendEmail = (message, multipleUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //message send through brevo SibApiV3Sdk
        //
        const msg = yield new brevo_1.default.TransactionalEmailsApi().sendTransacEmail(message);
        console.log("here in send mail", JSON.stringify(msg));
        return msg;
    }
    catch (error) {
        console.log("error from send email function");
        console.log(error, 'error');
    }
});
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map