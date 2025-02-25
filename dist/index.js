"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const constant_1 = __importDefault(require("./config/constant"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const socketlib_1 = __importDefault(require("./library/socketlib"));
process.on("uncaughtException", (error) => {
    console.log("uncauthException occured");
    console.log(error);
});
let httpServer = http.createServer(app_1.default);
;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
httpServer.listen(constant_1.default.app.PORT, () => {
    console.log(`Server listening at ${constant_1.default.app.PORT}`);
    socketlib_1.default.initConnection();
});
exports.default = io;
//# sourceMappingURL=index.js.map