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
// Import Config
const i18n_1 = __importDefault(require("../../../config/i18n"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
// Import Models
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const export_repo_1 = __importDefault(require("../repo/export.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save export file details media
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveExportDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        // check production exists or not
        //
        container.derived.productionDetails = yield production_repo_1.default.checkProductionByUuid(body.production_uuid);
        //
        //  validate total minutes export is exceed or not
        //
        yield validateS3Usage(container);
        //
        //  save export video details
        //
        yield saveExportData(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save export data
🗓 @created : 31/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveExportData = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  prepare data model to save the export data
        //
        const saveExportDetailsDataModel = {
            production_uuid: body.production_uuid,
            sequence_uuid: body.sequence_uuid,
            name: body.name,
            quality: body.quality,
            fps: body.fps,
            created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
            created_by: logged_in_user.uuid
        };
        //
        //  save export data
        //
        const exportData = yield export_repo_1.default.saveExportDetails(saveExportDetailsDataModel);
        //
        //  check production is bind with company or not
        //
        const productionDetails = yield production_repo_1.default.checkProductionByUuid(body.production_uuid);
        if (productionDetails.company_uuid) {
            //
            //  check company exists and get the details
            //
            var companyDetails = yield company_repos_1.default.checkCompanyExists(productionDetails.company_uuid);
        }
        //
        //  get user details
        //
        const userDetails = yield user_repo_1.default.getUserByUuid(exportData.created_by);
        //
        //  update HLS status
        //
        const hlsStatusModel = {
            hls_status: 'IN_PROGRESS'
        };
        //
        //  update export status
        //
        yield export_repo_1.default.updateExportFileStatus(exportData.uuid, hlsStatusModel);
        //
        //  send export uuid into response
        //
        const resultData = {
            production_export_uuid: exportData.uuid,
            sequence_uuid: exportData.sequence_uuid,
            quality: body.quality,
            user_uuid: exportData.created_by,
            company_uuid: companyDetails ? companyDetails.uuid : null,
            company_name: companyDetails ? companyDetails.name : null,
            production_name: productionDetails.name,
            user_name: userDetails.first_name,
            production_uuid: exportData.production_uuid
        };
        //
        //  store the result
        //
        container.output.result = resultData;
        container.output.message = i18n_1.default.__('export.process_started');
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : validate s3 usage should not be more than plan total usage.
🗓 @created : 17/10/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateS3Usage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        if (body.user_uuid) {
            //
            // get user current plan details
            //
            const currentSubscriptionDetails = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(body.user_uuid);
            if (currentSubscriptionDetails) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
                const totalUserMinutes = yield export_repo_1.default.getExportTotalMinutes(productionUuid, currentSubscriptionDetails.user_uuid);
                const totalUserMinutesC = yield export_repo_1.default.getExportTotalMinutesWithUserUsage(productionUuid);
                let totalUsedTime = 0;
                if (totalUserMinutesC.length > 0) {
                    totalUserMinutesC.forEach((time) => {
                        totalUsedTime += time.total_time;
                    });
                }
                //
                //  get all library by user uuid
                //
                const libraryUuid = yield library_repo_1.default.getLibraryByUserUuid(currentSubscriptionDetails.user_uuid);
                //
                //  get user library usage
                //
                const libraryUsage = yield library_repo_1.default.getUserLibraryUsage(libraryUuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalLibraryUsage = libraryUsage.total_usage ? parseInt(libraryUsage.total_usage) : 0;
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const totalUsage = totalProductionUsage + totalLibraryUsage;
                if (parseInt(totalUsedTime) >= parseInt(currentSubscriptionDetails.total_minutes)) {
                    const err = new Error(i18n_1.default.__('export.minutes_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
                if (totalUsage >= currentSubscriptionDetails.storage * 1073741824) {
                    const err = new Error(i18n_1.default.__('export.storage_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                const err = new Error(i18n_1.default.__('subscription.not_exists'));
                err.statusCode = 400;
                throw err;
            }
        }
        if (body.company_uuid) {
            //
            // get company current plan details
            //
            const currentSubscriptionDetails = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(body.company_uuid);
            if (currentSubscriptionDetails) {
                //
                //  get all the production by company uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
                //
                //  if yes then pass here logged in user here to get export minutes
                //
                const totalUserMinutes = yield export_repo_1.default.getExportTotalMinutes(productionUuid, currentSubscriptionDetails.company_uuid);
                // const totalUserMinutes = await exportRepo.getExportTotalMinutes(productionUuid,currentSubscriptionDetails.user_uuid);
                const totalUserMinutesC = yield export_repo_1.default.getExportTotalMinutesWithUserUsage(productionUuid);
                //
                //  get all the library by user uuid
                //
                const libraryUuid = yield library_repo_1.default.getAllLibraryByCompanyUuid(currentSubscriptionDetails.company_uuid);
                //
                //  get user library usage
                //
                const libraryUsage = yield library_repo_1.default.getUserLibraryUsage(libraryUuid);
                //
                //  get user production usage
                //
                const productionUsage = yield production_repo_1.default.getUserProductionUsage(productionUuid);
                const totalLibraryUsage = libraryUsage.total_usage ? parseInt(libraryUsage.total_usage) : 0;
                const totalProductionUsage = productionUsage.total_usage ? parseInt(productionUsage.total_usage) : 0;
                const totalUsage = totalProductionUsage + totalLibraryUsage;
                let totalUsedTime = 0;
                if (totalUserMinutesC.length > 0) {
                    totalUserMinutesC.forEach((time) => {
                        totalUsedTime += time.total_time;
                    });
                }
                if (parseInt(totalUsedTime) >= parseInt(currentSubscriptionDetails.total_minutes)) {
                    const err = new Error(i18n_1.default.__('export.minutes_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
                if (totalUsage >= currentSubscriptionDetails.storage * 1073741824) {
                    const err = new Error(i18n_1.default.__('export.storage_exceed'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                const err = new Error(i18n_1.default.__('subscription.not_exists'));
                err.statusCode = 400;
                throw err;
            }
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = saveExportDetails;
//# sourceMappingURL=saveExportDetails.service.js.map