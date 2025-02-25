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
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const i18n_1 = __importDefault(require("./config/i18n"));
const passport_1 = __importDefault(require("passport"));
// import passportAuth from "./middleware/passportAuth";
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.defaults();
    }
    defaults() {
        return __awaiter(this, void 0, void 0, function* () {
            const imageDir = path_1.default.join(__dirname, "/../assets");
            const imageDir1 = path_1.default.join(__dirname, "/../data");
            // Initialize Passport
            passport_1.default.initialize();
            // CORS Configuration
            this.express.use((req, res, next) => {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
                res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,content-type,Authorization,authentication-token");
                next();
            });
            // Middleware for parsing raw body specifically for AWS SNS
            this.express.use((req, res, next) => {
                if (req.headers["x-amz-sns-message-type"]) {
                    let rawBody = "";
                    req.on("data", (chunk) => {
                        rawBody += chunk;
                    });
                    req.on("end", () => {
                        req["rawBody"] = rawBody; // Attach raw body to request
                        next();
                    });
                }
                else {
                    next();
                }
            });
            // Middleware for parsing JSON and URL-encoded bodies
            this.express
                .use(bodyParser.json({ type: "application/json", limit: "150mb" }))
                .use(bodyParser.urlencoded({ extended: false, limit: "150mb" }))
                .use(bodyParser.raw());
            // Routes and other configurations
            this.express
                .use(routes_1.default)
                .use(i18n_1.default.init)
                .use("/assets", express_1.default.static(imageDir))
                .use("/data", express_1.default.static(imageDir1));
            // Uncomment this line if passportAuth is needed
            // .use(passportAuth.authenticateJwt);
        });
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map