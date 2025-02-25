"use strict";
// Import Config
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
// Import services
const saveTutorial_service_1 = __importDefault(require("../services/saveTutorial.service"));
const updateTutorial_service_1 = __importDefault(require("../services/updateTutorial.service"));
const listTutorialDetails_service_1 = __importDefault(require("../services/listTutorialDetails.service"));
const getTutorialDetailsByUuid_service_1 = __importDefault(require("../services/getTutorialDetailsByUuid.service"));
const updateTutorialStatus_service_1 = __importDefault(require("../services/updateTutorialStatus.service"));
const publishTutorial_service_1 = __importDefault(require("../services/publishTutorial.service"));
const unpublishTutorial_service_1 = __importDefault(require("../services/unpublishTutorial.service"));
const saveModule_service_1 = __importDefault(require("../services/saveModule.service"));
const listModuleDetails_service_1 = __importDefault(require("../services/listModuleDetails.service"));
const updateModule_service_1 = __importDefault(require("../services/updateModule.service"));
const getModuleDetailsByUuid_service_1 = __importDefault(require("../services/getModuleDetailsByUuid.service"));
const publishModule_service_1 = __importDefault(require("../services/publishModule.service"));
const unpublishModule_service_1 = __importDefault(require("../services/unpublishModule.service"));
const updateModuleStatus_service_1 = __importDefault(require("../services/updateModuleStatus.service"));
const getUserTutorialList_service_1 = __importDefault(require("../services/getUserTutorialList.service"));
const getUserModuleList_service_1 = __importDefault(require("../services/getUserModuleList.service"));
const getUserModuleDetailsByUuid_service_1 = __importDefault(require("../services/getUserModuleDetailsByUuid.service"));
const getUserTutorialDetailsByUuid_service_1 = __importDefault(require("../services/getUserTutorialDetailsByUuid.service"));
// Import Middleware
// Import Controllers
// Import Helpers
const response_helper_1 = __importDefault(require("../../../helpers/response.helper"));
const http_status_codes_1 = require("http-status-codes");
class AcademyController {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : To save tutorial
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveTutorial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // save tutorial service
                //
                yield (0, saveTutorial_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list tutorail details API
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listTutorialDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list tutorial details service
                //
                yield (0, listTutorialDetails_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update tutorial
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTutorial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update tutorial service
                //
                yield (0, updateTutorial_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get tutorial details by uuid
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getTutorialDetailsByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get tutorial details by uuid service
                //
                yield (0, getTutorialDetailsByUuid_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update tutorial status
    🗓 @created : 01/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateTutorialStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update tutorial details service
                //
                yield (0, updateTutorialStatus_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : publish tutorial
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    publishTutorial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  publish tutorial service
                //
                yield (0, publishTutorial_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : unpublish tutorial
    🗓 @created : 14/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    unpublishTutorial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  unpublish tutorial service
                //
                yield (0, unpublishTutorial_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : To save module
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveModule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                // save module service
                //
                yield (0, saveModule_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list module details API
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listModuleDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list module details service
                //
                yield (0, listModuleDetails_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update module
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateModule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update module service
                //
                yield (0, updateModule_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get module details by uuid
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getModuleDetailsByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get module details by uuid service
                //
                yield (0, getModuleDetailsByUuid_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update module status
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateModuleStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  update module details service
                //
                yield (0, updateModuleStatus_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : publish module
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    publishModule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  publish module service
                //
                yield (0, publishModule_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : unpublish module
    🗓 @created : 29/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    unpublishModule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  unpublish module service
                //
                yield (0, unpublishModule_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list user tutorial
    🗓 @created : 27/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserTutorialDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list tutorial details service
                //
                yield (0, getUserTutorialList_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user tutorial details by uuid
    🗓 @created :28/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserTutorialDetailsByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get user tutorial details by uuid service
                //
                yield (0, getUserTutorialDetailsByUuid_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : list user modules
    🗓 @created : 28/06/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    listUserModuleDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  list user module details service
                //
                yield (0, getUserModuleList_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user module details by uuid
    🗓 @created : 02/07/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserModuleDetailsByUuid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const container = {
                    input: {
                        body: req.body,
                        logged_in_user: req.logged_in_user,
                        params: req.params,
                        query: req.query
                    },
                    derived: {},
                    output: {
                        result: {}
                    }
                };
                //
                //  get module details by uuid service
                //
                yield (0, getUserModuleDetailsByUuid_service_1.default)(container);
                //
                // send the response
                //
                res.status(http_status_codes_1.StatusCodes.OK).json(yield response_helper_1.default.successResponse(container.output));
            }
            catch (error) {
                res.status(yield response_helper_1.default.getStatusCode(error))
                    .json(yield response_helper_1.default.validationErrorResponse(error));
            }
        });
    }
}
exports.default = new AcademyController();
//# sourceMappingURL=academy.controller.js.map