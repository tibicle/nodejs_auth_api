'use strict';
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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Libraries
const aws_1 = __importDefault(require("../../../library/aws"));
// Import Repos
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const user_repo_1 = __importDefault(require("../../user/repos/user.repo"));
const company_repos_1 = __importDefault(require("../../company/repos/company.repos"));
// Import Thirdparty
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
const production_repo_1 = __importDefault(require("../../production/repo/production.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const covertBytesToSize_helper_1 = __importDefault(require("../../../helpers/covertBytesToSize.helper"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get pre signed url service
🗓 @created : 09/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getPreSignedUrlService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        if (query.upload_type && query.upload_type == 'LIBRARY') {
            if (!(logged_in_user.roles.includes(constant_1.default.system_roles.SUPER_ADMIN)) && !(logged_in_user.roles.includes(constant_1.default.system_roles.VF_ADMIN_ADMINISTRATOR))) {
                //
                //  validate user has active subscription or not
                //
                yield validateActiveUserSubscription(container);
            }
            //
            //  validate storage
            //
            yield validateStorage(container);
            //
            //  get aws pre signed url to upload file
            //
            yield getAwsPreSignedUrl(container);
        }
        else {
            console.log("inside tutorial");
            //
            //  get pre signed url for module and tutorial
            //
            yield getPreSignedUrlForTutorialAndModule(container);
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get aws pre signed url
🗓 @created : 09/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getAwsPreSignedUrl = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  store bucket name 
        //
        const bucket = `${constant_1.default.app.AWS_BUCKET_NAME}`;
        if (query.company_uuid) {
            //
            //  check company folder exists or not
            //
            container.derived.companyDetails = yield company_repos_1.default.checkCompanyExists(query.company_uuid);
            const companyUuid = container.derived.companyDetails.uuid.replace(/-/g, '_');
            // if(container.derived.companyDetails.name.includes(" ")){
            // var companyName = container.derived.companyDetails.name.replace(/\s/g, '');
            // }else{
            // var companyName = container.derived.companyDetails.name
            // }
            var companyName = constant_1.default.folder_prefix.COMPANY;
            const companyFolder = `${companyName}_${companyUuid}/`;
            yield aws_1.default.checkAndCreateFolder(bucket, companyFolder);
            //
            //  create library folder inside company folder if not exists
            //
            const library = constant_1.default.folder.LIBRARY;
            //
            //  check library folder exists or not
            //
            const libraryFolder = `${companyFolder}${library}/`;
            var librarykey = yield aws_1.default.checkAndCreateFolder(bucket, libraryFolder);
            //
            //  check for user folder into library
            //
            const userDetails = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
            const userUuid = userDetails.uuid.replace(/-/g, '_');
            const userFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            const userLibraryFolder = `${libraryFolder}${userFolder}`;
            var librarykey = yield aws_1.default.checkAndCreateFolder(bucket, userLibraryFolder);
        }
        else {
            //
            //  check self folder exists or not
            //
            container.derived.userDetails = yield user_repo_1.default.getUserByUuid(logged_in_user.uuid);
            const userUuid = container.derived.userDetails.uuid.replace(/-/g, '_');
            const selfFolder = `${constant_1.default.folder_prefix.USER}_${userUuid}/`;
            yield aws_1.default.checkAndCreateFolder(bucket, selfFolder);
            //
            //  create library folder inside self folder if not exists
            //
            const library = constant_1.default.folder.LIBRARY;
            //
            //  check library folder exists or not
            //
            const libraryFolder = `${selfFolder}${library}/`;
            var librarykey = yield aws_1.default.checkAndCreateFolder(bucket, libraryFolder);
        }
        //
        //  generate key
        //
        const generateKey = Math.random() * 10000000;
        //
        //  parse generate key into int
        //
        const keyInt = parseInt(generateKey);
        //
        //  append the type into key name 
        //
        const key = `${librarykey}${keyInt.toString()}/${keyInt.toString()}.${query.type.split('/')[1]}`;
        const fileKey = `${keyInt.toString()}.${query.type.split('/')[1]}`;
        //
        //  get pre signed url
        //
        const preSignedUrl = yield aws_1.default.getPreSignedUrl(bucket, key, query.type);
        if (preSignedUrl) {
            if (query.type.split('/')[1] == 'gif') {
                //
                //  prepare model to save file into database
                //
                var saveFileDataModel = {
                    name: fileKey,
                    content_type: query.type,
                    type: query.type.split('/')[1],
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
            }
            else {
                //
                //  prepare model to save file into database
                //
                var saveFileDataModel = {
                    name: fileKey,
                    content_type: query.type,
                    type: query.type.split('/')[0],
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
            }
            //
            //  save file details
            //
            const fileDetails = yield file_repo_1.default.savePreSignedFileData(saveFileDataModel);
            const prepareResult = {
                uuid: fileDetails.uuid,
                name: fileDetails.name,
                pre_signed_url: preSignedUrl
            };
            container.output.result = prepareResult;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check user has active subscription or not
    🗓 @created : 03/09/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
const validateActiveUserSubscription = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        const currentDate = moment_timezone_1.default.utc().format("YYYY-MM-DD");
        //
        //  check company exists or not if company_uuid is there
        //
        if (query.company_uuid && query.company_uuid != null) {
            yield company_repos_1.default.checkCompanyExists(query.company_uuid);
            //
            //  check company have any pending subscription or not
            //
            const companyPendingSubscription = yield subscription_repo_1.default.getCompanyPendingSubscriptionByCompanyUuid(query.company_uuid);
            //
            //  check company have any already active subscription or not
            //
            const companySubscription = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(query.company_uuid);
            //
            //  check company approved status
            //
            const companyApprovedStatus = yield subscription_repo_1.default.getCompanyApprovedSubscriptionByCompanyUuid(query.company_uuid);
            if (companySubscription && companySubscription.status === constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (companyPendingSubscription) {
                if (companyPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || companyPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (companySubscription && companySubscription.status == 'ACTIVE' && (0, moment_timezone_1.default)(companySubscription.end_date).format('YYYY-MM-DD') < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(companySubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (companyApprovedStatus && companyApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!companySubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
                err.statusCode = 400;
                throw err;
            }
        }
        else {
            //
            //  check user have any pending subscription or not
            //
            const userPendingSubscription = yield subscription_repo_1.default.getUserPendingSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user have any active subscription or not
            //
            const userSubscription = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(logged_in_user.uuid);
            //
            //  check user approved status
            //
            const userApprovedStatus = yield subscription_repo_1.default.getUserApprovedSubscriptionByUserUuid(logged_in_user.uuid);
            if (userSubscription && userSubscription.status == constant_1.default.subscription_status.ACTIVE) {
                return;
            }
            else if (userPendingSubscription) {
                if (userPendingSubscription.subscription_status === constant_1.default.subscription_status.IS_FUTURE_RENEW || userPendingSubscription.subscription_status === constant_1.default.subscription_status.RENEWED) {
                    return;
                }
                else {
                    const err = new Error(i18n_1.default.__('subscription.already_in_pending_state'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            if (userSubscription && userSubscription.status == 'ACTIVE' && moment_timezone_1.default.utc(userSubscription.end_date).format("YYYY-MM-DD") < currentDate) {
                //
                //  update status of user subscription
                //
                const updateStatusModel = {
                    status: 'EXPIRED'
                };
                yield subscription_repo_1.default.updateUserSubscriptionStatus(userSubscription.uuid, updateStatusModel);
                const err = new Error(i18n_1.default.__('subscription.expire_subscription'));
                err.statusCode = 400;
                throw err;
            }
            else if (userApprovedStatus && userApprovedStatus.status == constant_1.default.subscription_status.APPROVED) {
                const err = new Error(i18n_1.default.__('subscription.approved_status_restriction'));
                err.statusCode = 400;
                throw err;
            }
            else if (!userSubscription) {
                const err = new Error(i18n_1.default.__('subscription.no_subscription'));
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
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check storage exceed or not
🗓 @created : 03/09/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateStorage = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, query, params, logged_in_user } } = container;
        if (query.company_uuid && query.company_uuid != null) {
            //
            // get company current plan details
            //
            const currentSubscriptionDetails = yield subscription_repo_1.default.getCompanyActiveSubscriptionByCompanyUuid(query.company_uuid);
            if (currentSubscriptionDetails) {
                //
                //  get all the production by company uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByCompanyUuid(currentSubscriptionDetails.company_uuid);
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
                const totalUsedStorage = yield covertBytesToSize_helper_1.default.convertBytes(totalUsage);
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
        else {
            //
            // get user current plan details
            //
            const currentSubscriptionDetails = yield subscription_repo_1.default.getUserActiveSubscriptionByUserUuid(logged_in_user.uuid);
            if (currentSubscriptionDetails) {
                //
                //  get all the production by user uuid
                //
                const productionUuid = yield production_repo_1.default.getAllProductionByUserUuid(currentSubscriptionDetails.user_uuid);
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
                const totalUsedStorage = yield covertBytesToSize_helper_1.default.convertBytes(totalUsage);
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
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get pre signed url for tutorial and module
🗓 @created : 06/11/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getPreSignedUrlForTutorialAndModule = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query, logged_in_user } } = container;
        //
        //  store bucket name 
        //
        const bucket = `${constant_1.default.app.AWS_BUCKET_NAME}`;
        const academyFolder = 'academy/';
        const objectKey = yield aws_1.default.checkAndCreateFolder(bucket, academyFolder);
        //
        //  generate key
        //
        const generateKey = Math.random() * 10000000;
        //
        //  parse generate key into int
        //
        const keyInt = parseInt(generateKey);
        //
        //  append the type into key name 
        //
        const key = `${objectKey}${keyInt.toString()}.${query.type.split('/')[1]}`;
        const fileKey = `${keyInt.toString()}.${query.type.split('/')[1]}`;
        //
        //  get pre signed url
        //
        const preSignedUrl = yield aws_1.default.getPreSignedUrl(bucket, key, query.type);
        if (preSignedUrl) {
            if (query.type.split('/')[1] == 'gif') {
                //
                //  prepare model to save file into database
                //
                var saveFileDataModel = {
                    name: fileKey,
                    content_type: query.type,
                    type: query.type.split('/')[1],
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
            }
            else {
                //
                //  prepare model to save file into database
                //
                var saveFileDataModel = {
                    name: fileKey,
                    content_type: query.type,
                    type: query.type.split('/')[0],
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss')
                };
            }
            //
            //  save file details
            //
            const fileDetails = yield file_repo_1.default.savePreSignedFileData(saveFileDataModel);
            if (query.desc == "TUTORIAL_DESC") {
                //
                //  update the file table with ref uuid and ref type
                //
                const updateFileData = {
                    ref_uuid: logged_in_user.uuid,
                    ref_type: "TUTORIAL_DESC"
                };
                //
                //  update file data
                //
                yield file_repo_1.default.updateFiledata(fileDetails.uuid, updateFileData);
                const getFileDetails = yield file_repo_1.default.getFileByUuid(fileDetails.uuid);
                const tutorialUrl = `${constant_1.default.app.CLOUDFRONT_URL}/academy/${getFileDetails.name}`;
                var prepareResult = {
                    uuid: fileDetails.uuid,
                    name: fileDetails.name,
                    pre_signed_url: preSignedUrl,
                    tutorial_url: tutorialUrl,
                    type: fileDetails.type
                };
            }
            else {
                var prepareResult = {
                    uuid: fileDetails.uuid,
                    name: fileDetails.name,
                    pre_signed_url: preSignedUrl,
                };
            }
            container.output.result = prepareResult;
        }
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getPreSignedUrlService;
//# sourceMappingURL=getPreSignedUrl.service.js.map