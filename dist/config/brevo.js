"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import third-Party
require("dotenv/config");
//import config
const constant_1 = __importDefault(require("../config/constant"));
//
//SibAPIV3Sdk require to use brevo api
//
var SibApiV3Sdk = require('sib-api-v3-sdk');
//
//API key of brevo api
//
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = constant_1.default.app.BREVO_API_KEY;
exports.default = SibApiV3Sdk;
//# sourceMappingURL=brevo.js.map