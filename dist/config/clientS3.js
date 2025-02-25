"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const constant_1 = __importDefault(require("./constant"));
//const S3:aws.S3 = new aws.S3();
const s3 = new client_s3_1.S3Client({
    region: `${constant_1.default.app.AWS_BUCKET_REGION}`,
    credentials: {
        secretAccessKey: `${constant_1.default.app.AWS_SECRET_ACCESS_KEY}`,
        accessKeyId: `${constant_1.default.app.AWS_ACCESS_KEY}`,
    }
});
exports.default = s3;
//# sourceMappingURL=clientS3.js.map