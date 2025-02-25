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
const constant_1 = __importDefault(require("../../../config/constant"));
const i18n_1 = __importDefault(require("../../../config/i18n"));
// Import Libraries
// Import services
//  Import Repo
const library_repo_1 = __importDefault(require("../repo/library.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant Shekhar
🚩 @uses : update video details service
🗓 @created : 27/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLibraryFileService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, query }, derived: { videoDetails } } = container;
        container.derived.updatedTag = [];
        //
        //  check library exists or not 
        //
        yield library_repo_1.default.validateLibrary(params.uuid);
        //
        //  validate Name
        //
        yield validateName(container);
        //
        //  get updated tag uuid 
        //
        yield getUpdatedTagUuid(container);
        //
        //update library file
        //
        yield updateLibraryDetails(container);
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
🗓 @created : 03/11/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const validateName = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user, query } } = container;
        if (body.name) {
            if (query.company_uuid) {
                //
                //  check library file name with company 
                //
                const companyLibraryDetails = yield library_repo_1.default.validateLibraryNameForCompany(body.name, query.company_uuid);
                if (companyLibraryDetails) {
                    const err = new Error(i18n_1.default.__("library.name_already_exist"));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                //
                //  check library file name with self upload
                //
                const selfLibraryDetails = yield library_repo_1.default.validateLibraryNameForSelf(body.name, logged_in_user.uuid);
                if (selfLibraryDetails) {
                    const err = new Error(i18n_1.default.__("library.name_already_exist"));
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
                container.derived.tag = yield library_repo_1.default.validateTag(body.tag[i]);
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
        yield library_repo_1.default.saveNewTag(tagModel);
        //
        //  store and push tag uuid in updated tag array
        //
        const getTagUuid = yield library_repo_1.default.validateTag(container.derived.tagname.toLowerCase());
        container.derived.updatedTag.push(getTagUuid.uuid);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Sushant shekhar
🚩 @uses : make model of update library details and store in database
🗓 @created : 27/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const updateLibraryDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params }, derived: { videoDetails } } = container;
        //
        //create update model
        //
        const updateLibraryModel = {
            name: body.name,
            description: body.description,
            tag_uuid: container.derived.updatedTag,
            updated_at: moment_timezone_1.default.utc().format("YYYY-MM-DD HH:mm:ss")
        };
        //
        //store update video details
        //
        yield library_repo_1.default.updateLibraryDetails(params.uuid, updateLibraryModel);
        container.output.message = i18n_1.default.__('library.library_updated');
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = updateLibraryFileService;
//# sourceMappingURL=updateLibraryFileDetails.service.js.map