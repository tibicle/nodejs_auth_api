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
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Static
// Import Middleware
// Import Controllers
// Import Interface
// Import Helpers
// Import validations
// Import Transformers
// Import Libraries
// Import Models
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update production service
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateProductionService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        container.derived.updatedTag = [];
        //
        //  check production exists or not 
        //
        container.derived.productionDetails = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        //
        //  validate Name
        //
        yield checkName(container);
        //
        //  get updated category uuid 
        //
        //await getUpdatedCategoryUuid(container)
        //
        //  get updated tag uuid 
        //
        //await getUpdatedTagUuid(container)
        //
        //  store updated detials in production database
        //
        yield storeUpdateProduction(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : check name is already present with same company or not
🗓 @created : 1/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const checkName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { productionDetails } } = container;
        if (body.company_uuid) {
            //
            //  check production exists or not in particular company
            //
            const companyProductionValidation = yield production_repo_1.default.validateProductionNameForCompany(body.name, body.company_uuid);
            if (companyProductionValidation) {
                if (companyProductionValidation.uuid === params.production_uuid) {
                    if (body.name.toLowerCase() === companyProductionValidation.name.toLowerCase()) {
                        return container;
                    }
                }
                else {
                    const err = new Error(i18n_1.default.__("production.name_already_exist"));
                    err.statusCode = 400;
                    throw err;
                }
            }
        }
        else {
            //
            //  check production exists or not for self
            //
            const selfProductionValidation = yield production_repo_1.default.validateProductionNameForSelf(body.name, logged_in_user.uuid);
            if (selfProductionValidation) {
                if (selfProductionValidation.uuid === params.production_uuid) {
                    if (body.name.toLowerCase() === selfProductionValidation.name.toLowerCase()) {
                        return container;
                    }
                    else {
                        const err = new Error(i18n_1.default.__("production.name_already_exist"));
                        err.statusCode = 400;
                        throw err;
                    }
                }
                else {
                    const err = new Error(i18n_1.default.__("production.name_already_exist"));
                    err.statusCode = 400;
                    throw err;
                }
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
🚩 @uses : get updated category uuid by category name and store in container
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUpdatedCategoryUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        //
        //  check category name exist or not
        //
        if (body.category) {
            container.derived.category = yield production_repo_1.default.validateCategory(body.category);
            if (!container.derived.category || container.derived.category == undefined) {
                //
                // if category not found throw error
                //
                const err = new Error(i18n_1.default.__("production.category_not_exist"));
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
🚩 @uses : get updated tag uuid by tag name and store in container
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getUpdatedTagUuid = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query } } = container;
        //
        //  check tag name exist or not in body
        //
        if (body.tag || body.tag != null) {
            for (let i = 0; i < body.tag.length; i++) {
                //
                // validate tag is present or not
                //
                container.derived.tag = yield production_repo_1.default.validateTag(body.tag[i]);
                if (container.derived.tag) {
                    //
                    //  store update tag uuid in array
                    //
                    container.derived.updatedTag.push(container.derived.tag.uuid);
                }
                if (!container.derived.tag || container.derived.tag == undefined) {
                    //
                    // if tag not found insert new tag
                    //
                    container.derived.tagname = body.tag[i];
                    yield storeTag(container);
                }
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
🚩 @uses : story new tag in tag database
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeTag = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create tag model 
        //
        const tagModel = {
            name: container.derived.tagname.toLowerCase(),
            type: constant_1.default.tag_type.PRODUCTION,
            created_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //  store new category in category database
        //
        yield production_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in updated tag array
        //
        const getTagUuid = yield production_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.updatedTag.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : get updated category uuid by category name and store in container
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const storeUpdateProduction = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  create update production model
        //
        const updateProductionModel = {
            user_uuid: logged_in_user.uuid,
            name: body.name,
            description: body.description,
            tag_uuid: container.derived.updatedTag,
            deadline: body.deadline,
            project_type: body.project_type,
            production_idea: body.production_idea,
            production_style: body.production_style,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_by: logged_in_user.uuid
        };
        if (body.category) {
            updateProductionModel.category_uuid = container.derived.category.uuid;
        }
        //
        //  store update production model in production table 
        //
        yield production_repo_1.default.updateProductionDetails(params.production_uuid, updateProductionModel);
        //
        //  add success message
        //
        container.output.message = i18n_1.default.__('production.production_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateProductionService;
//# sourceMappingURL=updateProduction.service.js.map