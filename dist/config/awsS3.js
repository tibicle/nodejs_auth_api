"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const constant_1 = __importDefault(require("./constant"));
aws_sdk_1.default.config.update({
    secretAccessKey: `${constant_1.default.app.AWS_SECRET_ACCESS_KEY}`,
    accessKeyId: `${constant_1.default.app.AWS_ACCESS_KEY}`,
    region: `${constant_1.default.app.AWS_BUCKET_REGION}`,
    signatureVersion: 'v4'
});
const S3 = new aws_sdk_1.default.S3();
exports.default = S3;
//# sourceMappingURL=awsS3.js.map