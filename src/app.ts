import express, { NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import i18n from "./config/i18n";
import passport from "passport";
// import passportAuth from "./middleware/passportAuth";
import router from "./routes";
import config from "./config/constant";
import path from "path";

class App {
    public express;

    constructor() {
        this.express = express();
        this.defaults();
    }

    private async defaults(): Promise<void> {
        const imageDir = path.join(__dirname, "/../assets");
        const imageDir1 = path.join(__dirname, "/../data");

        // Initialize Passport
        passport.initialize();

        // CORS Configuration
        this.express.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,content-type,Authorization,authentication-token");
            next();
        });

        // Middleware for parsing raw body specifically for AWS SNS
        this.express.use((req: any, res: Response, next: NextFunction) => {
            if (req.headers["x-amz-sns-message-type"]) {
                let rawBody = "";
                req.on("data", (chunk:any) => {
                    rawBody += chunk;
                });
                req.on("end", () => {
                    req["rawBody"] = rawBody; // Attach raw body to request
                    next();
                });
            } else {
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
            .use(router)
            .use(i18n.init)
            .use("/assets", express.static(imageDir))
            .use("/data", express.static(imageDir1));

        // Uncomment this line if passportAuth is needed
        // .use(passportAuth.authenticateJwt);
    }
}

export default new App().express;
