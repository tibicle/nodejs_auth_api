"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Import Config
const i18n_1 = __importDefault(require("../config/i18n"));
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
const file_route_1 = __importDefault(require("../app/file/routes/file.route"));
const video_route_1 = __importDefault(require("../app/viedo/routes/video.route"));
const auth_route_1 = __importDefault(require("../app/auth/routes/auth.route"));
const library_route_1 = __importDefault(require("../app/library/routes/library.route"));
const production_route_1 = __importDefault(require("../app/production/routes/production.route"));
const company_route_1 = __importDefault(require("../app/company/routes/company.route"));
const user_route_1 = __importDefault(require("../app/user/routes/user.route"));
const export_route_1 = __importDefault(require("../app/export/routes/export.route"));
const category_route_1 = __importDefault(require("../app/category/routes/category.route"));
const team_route_1 = __importDefault(require("../app/team/routes/team.route"));
const userPermission_routes_1 = __importDefault(require("../app/userPermission/routes/userPermission.routes"));
const staff_route_1 = __importDefault(require("../app/staff/routes/staff.route"));
const organization_route_1 = __importDefault(require("../app/organization/routes/organization.route"));
const tutorial_route_1 = __importDefault(require("../app/tutorialManagement/routes/tutorial.route"));
const staticPage_route_1 = __importDefault(require("../app/staticPageManagement/routes/staticPage.route"));
const errorLog_route_1 = __importDefault(require("../app/errorLog/routes/errorLog.route"));
const font_route_1 = __importDefault(require("../app/font/routes/font.route"));
const subscription_route_1 = __importDefault(require("../app/subscription/routes/subscription.route"));
const transaction_route_1 = __importDefault(require("../app/transaction/routes/transaction.route"));
const academy_route_1 = __importDefault(require("../app/academy/routes/academy.route"));
const dashboard_route_1 = __importDefault(require("../app/dashboard/routes/dashboard.route"));
const aiAssistant_route_1 = __importDefault(require("../app/aiAssistant/routes/aiAssistant.route"));
const country_routes_1 = __importDefault(require("../app/country/routes/country.routes"));
// Import Thirdparty
const express_1 = __importDefault(require("express"));
const app = express_1.default.Router();
app.get("/v1/ping", function (req, res, next) {
    res.send(i18n_1.default.__("welcome_msg"));
});
const path = "/v1";
app.use(path + "/s3", file_route_1.default);
app.use(path + "/video", video_route_1.default);
app.use(path + "/auth", auth_route_1.default);
app.use(path + "/library", library_route_1.default);
app.use(path + "/production", production_route_1.default);
app.use(path + "/company", company_route_1.default);
app.use(path + "/user", user_route_1.default);
app.use(path + "/export", export_route_1.default);
app.use(path + "/category", category_route_1.default);
app.use(path + "/team", team_route_1.default);
app.use(path + "/permission", userPermission_routes_1.default);
app.use(path + "/staff", staff_route_1.default);
app.use(path + "/organization", organization_route_1.default);
app.use(path + "/tutorial", tutorial_route_1.default);
app.use(path + "/static", staticPage_route_1.default);
app.use(path + "/error", errorLog_route_1.default);
app.use(path + "/font", font_route_1.default);
app.use(path + "/subscription", subscription_route_1.default);
app.use(path + "/transaction", transaction_route_1.default);
app.use(path + "/academy", academy_route_1.default);
app.use(path + "/dashboard", dashboard_route_1.default);
app.use(path + "/ai-assistant", aiAssistant_route_1.default);
app.use(path + "/country", country_routes_1.default);
module.exports = app;
//# sourceMappingURL=index.js.map