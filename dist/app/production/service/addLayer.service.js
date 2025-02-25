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
const file_repo_1 = __importDefault(require("../../file/repo/file.repo"));
const library_repo_1 = __importDefault(require("../../library/repo/library.repo"));
const production_repo_1 = __importDefault(require("../repo/production.repo"));
const video_repo_1 = __importDefault(require("../../viedo/repo/video.repo"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const s3Folder_helper_1 = __importDefault(require("../../../helpers/s3Folder.helper"));
const font_repo_1 = __importDefault(require("../../font/repo/font.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save layer service
🗓 @created : 18/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addLayerService = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params } } = container;
        //
        //  check production exists or not
        //
        yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
        if (body.file_uuid) {
            //
            //  check file exists into production media or not 
            //
            yield production_repo_1.default.checkFileInProductionMedia(params.production_uuid, body.file_uuid);
        }
        //
        //  add layer into production time line 
        //
        yield addIntoProductionTimeLine(container);
        //
        //  prepare and send response 
        //
        yield sendResponse(container);
        return container;
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : add layer into production time line
🗓 @created : 18/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const addIntoProductionTimeLine = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user } } = container;
        //
        //  check for sort order
        //
        let order = yield production_repo_1.default.getSortOrder(params.production_uuid);
        if (order) {
            var sortOrder = order.sort_order + 1;
        }
        else {
            var sortOrder = 1;
        }
        if (body.layer_type == constant_1.default.layer_type.VIDEO) {
            //
            //  prepare data model to add layer into production time line
            //
            const addLayerDataModel = [{
                    production_uuid: params.production_uuid,
                    sequence_uuid: body.sequence_uuid,
                    file_uuid: body.file_uuid ? body.file_uuid : null,
                    layer_type: body.layer_type,
                    sort_order: sortOrder,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: logged_in_user.uuid
                }];
            //
            //  save layer into production timeline
            //
            // const videoDetails = await productionRepo.addLayerInProductionTimeLine(addLayerDataModel);
            const videoDetails = addLayerDataModel;
            //
            //  prepare data model to add audio layer into production time line
            //
            const addAudioDataModel = [{
                    production_uuid: params.production_uuid,
                    sequence_uuid: body.sequence_uuid,
                    file_uuid: body.file_uuid ? body.file_uuid : null,
                    layer_type: constant_1.default.layer_type.AUDIO,
                    sort_order: sortOrder + 1,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: logged_in_user.uuid
                }];
            //
            //  save layer into production timeline
            //
            // const audioDetails = await productionRepo.addLayerInProductionTimeLine(addAudioDataModel);
            const audioDetails = addAudioDataModel;
            container.derived.layerDetails = videoDetails.concat(audioDetails);
        }
        else if (body.layer_type == constant_1.default.layer_type.TEXT) {
            //
            // get Poppins font details 
            //
            const poppinsFontData = yield font_repo_1.default.getFontByName('Poppins');
            if (!poppinsFontData) {
                const fontData = yield font_repo_1.default.getFontData();
                if (fontData) {
                    container.derived.fontObject = {
                        font: {
                            fontUrl: fontData.font_details.length > 0
                                ? (fontData.font_details[0].cdn_url === null ? fontData.font_details[0].file_url : fontData.font_details[0].cdn_url)
                                : null,
                            fontFill: "#FFFFFF",
                            fontSize: 15.258,
                            textAlign: "left",
                            fontFamily: fontData.title,
                            fontWeight: 400,
                            displayFontSize: 28.26
                        },
                        position: {
                            width: 140,
                            height: 25,
                            left: 0,
                            top: 0,
                        },
                        text: "Write Text Here"
                    };
                    const addLayerDataModel = {
                        production_uuid: params.production_uuid,
                        sequence_uuid: body.sequence_uuid,
                        file_uuid: body.file_uuid ? body.file_uuid : null,
                        layer_data: container.derived.fontObject,
                        layer_type: body.layer_type,
                        sort_order: sortOrder,
                        created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                        created_by: logged_in_user.uuid
                    };
                    //
                    //  save layer into production timeline
                    //
                    container.derived.layerDetails = yield production_repo_1.default.addLayerInProductionTimeLine(addLayerDataModel);
                }
                else {
                    const err = new Error(i18n_1.default.__('font.add_font_error'));
                    err.statusCode = 400;
                    throw err;
                }
            }
            else {
                container.derived.fontObject = {
                    font: {
                        fontUrl: poppinsFontData.font_details.length > 0
                            ? (poppinsFontData.font_details[0].cdn_url || poppinsFontData.font_details[0].file_url)
                            : null,
                        fontFill: "#FFFFFF",
                        fontSize: 15.258,
                        textAlign: "left",
                        fontFamily: poppinsFontData.title,
                        fontWeight: 400,
                        displayFontSize: 28.26
                    },
                    position: {
                        width: 140,
                        height: 25,
                        left: 0,
                        top: 0,
                    },
                    text: "Write Text Here"
                };
                const addLayerDataModel = {
                    production_uuid: params.production_uuid,
                    sequence_uuid: body.sequence_uuid,
                    file_uuid: body.file_uuid ? body.file_uuid : null,
                    layer_data: container.derived.fontObject,
                    layer_type: body.layer_type,
                    sort_order: sortOrder,
                    created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                    created_by: logged_in_user.uuid
                };
                //
                //  save layer into production timeline
                //
                container.derived.layerDetails = yield production_repo_1.default.addLayerInProductionTimeLine(addLayerDataModel);
            }
        }
        else {
            //
            //  prepare data model to add layer into production time line
            //
            const addLayerDataModel = {
                production_uuid: params.production_uuid,
                sequence_uuid: body.sequence_uuid,
                file_uuid: body.file_uuid ? body.file_uuid : null,
                layer_type: body.layer_type,
                sort_order: sortOrder,
                created_at: moment_timezone_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                created_by: logged_in_user.uuid
            };
            //
            //  save layer into production timeline
            //
            container.derived.layerDetails = yield production_repo_1.default.addLayerInProductionTimeLine(addLayerDataModel);
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
🚩 @uses : prepare and send response
🗓 @created : 18/10/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const sendResponse = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, params, logged_in_user }, derived: { layerDetails, fontObject } } = container;
        if (body.file_uuid) {
            //
            //  get file details 
            //
            container.derived.file = yield file_repo_1.default.getFileByUuid(body.file_uuid);
            //
            //  get low res file details
            //
            container.derived.low_res_file = yield file_repo_1.default.getLowResFileByFileUuid(body.file_uuid);
            //
            //  get library details
            //
            container.derived.library = yield library_repo_1.default.getLibraryByFileUuid(body.file_uuid);
            //
            //  check company is bind with the production or not
            //
            const productionDetails = yield production_repo_1.default.checkProductionByUuid(params.production_uuid);
            if (productionDetails.company_uuid) {
                //
                //  check file exists into production media or not 
                //
                const libraryDetails = yield production_repo_1.default.checkFileInProductionMedia(params.production_uuid, body.file_uuid);
                //
                // get the file path
                //
                var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, libraryDetails.user_uuid, container.derived.file.name);
            }
            else {
                var fileUrl = yield s3Folder_helper_1.default.getFolderPath(productionDetails.company_uuid, logged_in_user.uuid, container.derived.file.name);
            }
            //
            //  prepare file data object for result 
            //
            var fileDataObject = {
                uuid: body.file_uuid,
                url: `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${container.derived.file.name}`,
                length: container.derived.file ? (container.derived.file.length !== null ? container.derived.file.length : null) : null,
                size: null,
                quality: container.derived.file ? (container.derived.file.quality !== null ? container.derived.file.quality : null) : null,
                name: container.derived.file.name,
                audio_url: null,
                thumbnail_url: null,
                display_name: container.derived.library.name,
                low_res_file_url: container.derived.low_res_file ? `${constant_1.default.app.CLOUDFRONT_URL}/${fileUrl}/${container.derived.low_res_file.name}` : null,
                frames: []
            };
            //
            //  get thumbnail and audio url if layer type is video
            //
            if (body.layer_type == constant_1.default.layer_type.VIDEO) {
                if (container.derived.file.thumbnail_file_name) {
                    fileDataObject.thumbnail_url = `${constant_1.default.app.CLOUDFRONT_URL}` + '/' + `${fileUrl}` + '/' + container.derived.file.thumbnail_file_name;
                }
                if (container.derived.file.audio_name) {
                    fileDataObject.audio_url = `${constant_1.default.app.CLOUDFRONT_URL}` + '/' + `${fileUrl}` + '/' + container.derived.file.audio_name;
                }
                //
                //  get frames if exists
                //
                const frames = yield video_repo_1.default.getFrames(body.file_uuid);
                if (frames) {
                    const resultFrames = frames.frame;
                    const finalFrames = resultFrames.sort((a, b) => {
                        const frameNumberA = parseInt(a.match(/frame_(\d+)/)[1]);
                        const frameNumberB = parseInt(b.match(/frame_(\d+)/)[1]);
                        return frameNumberA - frameNumberB;
                    }).map((frame) => constant_1.default.app.CLOUDFRONT_URL + '/' + frame);
                    fileDataObject.frames = finalFrames;
                }
            }
        }
        //
        //  prepare layer data object for result
        //
        var layerDataObject = {
            start_time: null,
            end_time: null
        };
        var resultArray = [];
        if (layerDetails && layerDetails.length > 1) {
            for (const data of layerDetails) {
                const outputResult = {
                    // uuid: data.uuid,
                    sequence_uuid: data.sequence_uuid,
                    layer_type: data.layer_type,
                    layer_data: layerDataObject,
                    sort_order: data.sort_order
                };
                if (data.layer_type == constant_1.default.layer_type.VIDEO) {
                    if (fileDataObject.frames.length > 0) {
                        outputResult.file_data = fileDataObject;
                        const videoDetails = yield production_repo_1.default.addLayerInProductionTimeLine(data);
                        outputResult.uuid = videoDetails[0].uuid;
                    }
                    else {
                        container.derived.fileType = constant_1.default.layer_type.VIDEO;
                        outputResult.file_data = fileDataObject;
                    }
                }
                else {
                    var fileDataObject1 = {
                        uuid: fileDataObject.uuid,
                        url: fileDataObject.url,
                        length: fileDataObject.length,
                        size: fileDataObject.size,
                        quality: fileDataObject.quality,
                        audio_url: fileDataObject.audio_url,
                        thumbnail_url: fileDataObject.thumbnail_url,
                        display_name: container.derived.library.name,
                        frames: []
                    };
                    outputResult.file_data = fileDataObject1;
                    if (fileDataObject1.audio_url && fileDataObject.frames.length > 0) {
                        const audioDetails = yield production_repo_1.default.addLayerInProductionTimeLine(data);
                        outputResult.uuid = audioDetails[0].uuid;
                    }
                    else {
                        // container.derived.fileType = config.layer_type.AUDIO
                        outputResult.file_data = fileDataObject;
                    }
                }
                resultArray.push(outputResult);
            }
        }
        else {
            const outputResult = {
                uuid: layerDetails[0].uuid,
                sequence_uuid: body.sequence_uuid,
                layer_type: body.layer_type,
                file_data: fileDataObject,
                layer_data: body.layer_type == constant_1.default.layer_type.TEXT ? fontObject : layerDataObject,
                sort_order: layerDetails[0].sort_order
            };
            resultArray.push(outputResult);
        }
        container.output.result = resultArray;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = addLayerService;
//# sourceMappingURL=addLayer.service.js.map