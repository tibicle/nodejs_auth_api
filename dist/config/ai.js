"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import third-Party
require("dotenv/config");
//import config
const constant_1 = __importDefault(require("../config/constant"));
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: constant_1.default.app.AI_ASSISTANT.AI_ASSISTANT_KEY,
});
exports.default = openai;
//# sourceMappingURL=ai.js.map