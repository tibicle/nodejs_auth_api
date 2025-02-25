// Import Config
import i18n from "../config/i18n";

// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Validators

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

// Import Routes
import s3 from "../app/file/routes/file.route";
import auth from "../app/auth/routes/auth.route";
import user from "../app/user/routes/user.route";

// Import Thirdparty
import express from "express";

const app = express.Router();

app.get("/v1/ping", function (req, res:any, next) {

	res.send(i18n.__("welcome_msg"));
	
});

const path = "/v1";

app.use(path + "/s3", s3);
app.use(path + "/auth", auth);
app.use(path + "/user", user);

export = app;