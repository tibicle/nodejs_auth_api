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
//  Import Config
const index_1 = __importDefault(require("../index"));
const constant_1 = __importDefault(require("../config/constant"));
// Import Services
const saveSocket_service_1 = __importDefault(require("../app/socket/services/saveSocket.service"));
//  Import Repo
const socket_repo_1 = __importDefault(require("../app/socket/repo/socket.repo"));
const moment_1 = __importDefault(require("moment"));
const production_repo_1 = __importDefault(require("../app/production/repo/production.repo"));
class SocketLib {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : created socket init function
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            //
            //  connect socket
            //
            index_1.default.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
                //
                //  save the socket user 
                //
                yield (0, saveSocket_service_1.default)(socket.id, socket.handshake.query.user_uuid);
                socket.to(socket.id).emit('ping', 'socket is connected');
                index_1.default.to(socket.id).emit('ping', 'socket is connected');
                socket.on('pong', () => {
                    console.log("pong received");
                });
                //
                //  disconnect socket
                //
                socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                    //
                    //  delete user socket from database
                    //
                    yield socket_repo_1.default.deleteUserBySocketId(socket.id);
                }));
            }));
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : send event when frame is generated
    🗓 @created : 28/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    sendFileUuid(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user, params, query }, derived: { saveFrames, production, timeLineUuid, layerDetails, storeFrames, audio, audioData } } = container;
                //
                //  get receiver socket id
                //
                const socketId = yield socket_repo_1.default.getSocketId(logged_in_user.uuid);
                if (socketId && socketId.length > 0) {
                    if (storeFrames && storeFrames.length >= 0) {
                        let storeUuid = [];
                        for (const data of layerDetails) {
                            if (data.layer_type == constant_1.default.layer_type.VIDEO) {
                                //
                                //  prepare data model to add layer into production time line
                                //
                                const addLayerDataModel = {
                                    production_uuid: query.production_uuid,
                                    sequence_uuid: body.sequence_uuid,
                                    file_uuid: body.file_uuid ? body.file_uuid : null,
                                    layer_type: data.layer_type,
                                    sort_order: data.sort_order,
                                    created_at: moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                    created_by: logged_in_user.uuid
                                };
                                //
                                //  save layer into production timeline
                                //
                                const [videoDetails] = yield production_repo_1.default.addLayerInProductionTimeLine(addLayerDataModel);
                                storeUuid.push(videoDetails.uuid);
                            }
                            if (audio) {
                                if (data.layer_type == constant_1.default.layer_type.AUDIO) {
                                    //
                                    //  prepare data model to add layer into production time line
                                    //
                                    const addAudioDataModel = {
                                        production_uuid: query.production_uuid,
                                        sequence_uuid: body.sequence_uuid,
                                        file_uuid: body.file_uuid ? body.file_uuid : null,
                                        layer_type: data.layer_type,
                                        sort_order: data.sort_order,
                                        created_at: moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                        created_by: logged_in_user.uuid
                                    };
                                    //
                                    //  save layer into production timeline
                                    //
                                    const [audioDetails] = yield production_repo_1.default.addLayerInProductionTimeLine(addAudioDataModel);
                                    storeUuid.push(audioDetails.uuid);
                                }
                            }
                        }
                        //
                        //  message socket event
                        //
                        socketId.map((socketId) => {
                            index_1.default.to(socketId.socket_id).emit('frame_generated', {
                                'user_uuid': logged_in_user.uuid,
                                'production_uuid': production,
                                'file_uuid': saveFrames.file_uuid,
                                'timeline_uuid': timeLineUuid.length > 0 ? timeLineUuid : storeUuid
                            });
                        });
                        //
                        //  prepare data model to mark is active false
                        //
                        const isActiveDataModel = {
                            is_active: false
                        };
                        yield production_repo_1.default.updateProductionDetails(query.production_uuid, isActiveDataModel);
                    }
                    else {
                        //
                        //  audio failed socket event
                        //
                        socketId.map((socketId) => {
                            index_1.default.to(socketId.socket_id).emit('frame_generation_failed', {
                                'failed': true,
                                'production_uuid': query.production_uuid,
                                'message': `Sorry we can't generate frames for this video`
                            });
                        });
                        //
                        //  prepare data model to mark is active false
                        //
                        const isActiveDataModel = {
                            is_active: false
                        };
                        yield production_repo_1.default.updateProductionDetails(query.production_uuid, isActiveDataModel);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : send audio socket with details
    🗓 @created : 20/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    // async sendAudioDetails(container:any) {
    //     try {
    //         const {
    //             input: {
    //                 body,
    //                 logged_in_user,
    //                 params
    //             },
    //             derived: {
    //                 saveFrames,
    //                 production,
    //                 timeLineUuid,
    //                 layerDetails,
    //                 storeFrames,
    //                 audio
    //             }
    //         } = container;
    //         //
    //         //  get receiver socket id
    //         //
    //         const socketId = await socketRepo.getSocketId(logged_in_user.uuid);
    //         if (socketId && socketId.length > 0) {
    //             if(audio){
    //                 for(const data of layerDetails){
    //                     if(data.layer_type == config.layer_type.AUDIO){
    //                         const addAudioDataModel = {
    //                             production_uuid: params.production_uuid,
    //                             sequence_uuid: body.sequence_uuid,
    //                             file_uuid: body.file_uuid ? body.file_uuid : null,
    //                             layer_type: config.layer_type.AUDIO,
    //                             sort_order: data.sort_order,
    //                             created_at: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
    //                             created_by: logged_in_user.uuid
    //                         }
    //                         //
    //                         //  save layer into production timeline
    //                         //
    //                         const audioDetails = await productionRepo.addLayerInProductionTimeLine(addAudioDataModel);
    //                         var audioUuid = audioDetails[0].uuid
    //                         console.log(audioUuid);
    //                     }
    //                 }
    //                 //
    //                 //  message socket event
    //                 //
    //                 socketId.map((socketId:any)=> {
    //                     io.to(socketId.socket_id).emit(
    //                         'audio_generated',
    //                             {
    //                                 'user_uuid': logged_in_user.uuid,
    //                                 'production_uuid': production,
    //                                 'file_uuid': saveFrames.file_uuid,
    //                                 'timeline_uuid': timeLineUuid ? timeLineUuid : audioUuid
    //                             }
    //                     );
    //                 });
    //             }else{
    //                 //
    //                 //  audio failed socket event
    //                 //
    //                 socketId.map((socketId:any)=> {
    //                     io.to(socketId.socket_id).emit(
    //                         'audio_generation_failed'
    //                     );
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    /*
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        👑 @creator : Sushant Shekhar
        🚩 @uses : send event when low resolution video is generated.
        🗓 @created : 28/08/2023
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        */
    sendLowResFileUuid(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //
                //  get receiver socket id
                //
                const socketId = yield socket_repo_1.default.getSocketId(jobData.user_uuid);
                if (socketId && socketId.length > 0) {
                    //
                    //  message socket event
                    //
                    socketId.map((socketId) => {
                        index_1.default.to(socketId.socket_id).emit('video_converted', {
                            'user_uuid': jobData.user_uuid && jobData.company_uuid == null ? jobData.user_uuid : null,
                            'company_uuid': jobData.company_uuid && jobData.company_uuid != null ? jobData.company_uuid : null,
                        });
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : sushnat shekhar
   🚩 @uses : send event when frame is generated
   🗓 @created : 28/08/2023
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    sendDetailsFileUuid(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input: { body, logged_in_user, params, query }, derived: { saveFrames, production, timeLineUuid, layerDetails, storeFrames, audio, audioData } } = container;
                //
                //  get receiver socket id
                //
                const socketId = yield socket_repo_1.default.getSocketId(logged_in_user.uuid);
                if (socketId && socketId.length > 0) {
                    if (storeFrames == true) {
                        let storeUuid = [];
                        for (const data of layerDetails) {
                            if (data.layer_type == constant_1.default.layer_type.VIDEO) {
                                //
                                //  prepare data model to add layer into production time line
                                //
                                const addLayerDataModel = {
                                    production_uuid: query.production_uuid,
                                    sequence_uuid: body.sequence_uuid,
                                    file_uuid: body.file_uuid ? body.file_uuid : null,
                                    layer_type: data.layer_type,
                                    sort_order: data.sort_order,
                                    created_at: moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                    created_by: logged_in_user.uuid
                                };
                                //
                                //  save layer into production timeline
                                //
                                const [videoDetails] = yield production_repo_1.default.addLayerInProductionTimeLine(addLayerDataModel);
                                storeUuid.push(videoDetails.uuid);
                            }
                            if (audio == true) {
                                if (data.layer_type == constant_1.default.layer_type.AUDIO) {
                                    //
                                    //  prepare data model to add layer into production time line
                                    //
                                    const addAudioDataModel = {
                                        production_uuid: query.production_uuid,
                                        sequence_uuid: body.sequence_uuid,
                                        file_uuid: body.file_uuid ? body.file_uuid : null,
                                        layer_type: data.layer_type,
                                        sort_order: data.sort_order,
                                        created_at: moment_1.default.utc().format('YYYY-MM-DD HH:mm:ss'),
                                        created_by: logged_in_user.uuid
                                    };
                                    //
                                    //  save layer into production timeline
                                    //
                                    const [audioDetails] = yield production_repo_1.default.addLayerInProductionTimeLine(addAudioDataModel);
                                    storeUuid.push(audioDetails.uuid);
                                }
                            }
                        }
                        //
                        //  message socket event
                        //
                        socketId.map((socketId) => {
                            index_1.default.to(socketId.socket_id).emit('frame_generated', {
                                'user_uuid': logged_in_user.uuid,
                                'production_uuid': production,
                                'file_uuid': saveFrames.file_uuid,
                                'timeline_uuid': timeLineUuid.length > 0 ? timeLineUuid : storeUuid
                            });
                        });
                        //
                        //  prepare data model to mark is active false
                        //
                        const isActiveDataModel = {
                            is_active: false
                        };
                        yield production_repo_1.default.updateProductionDetails(query.production_uuid, isActiveDataModel);
                    }
                    else {
                        //
                        //  audio failed socket event
                        //
                        socketId.map((socketId) => {
                            index_1.default.to(socketId.socket_id).emit('frame_generation_failed', {
                                'failed': true,
                                'production_uuid': query.production_uuid,
                                'message': `Sorry we can't generate frames for this video`
                            });
                        });
                        //
                        //  prepare data model to mark is active false
                        //
                        const isActiveDataModel = {
                            is_active: false
                        };
                        yield production_repo_1.default.updateProductionDetails(query.production_uuid, isActiveDataModel);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new SocketLib();
//# sourceMappingURL=socketlib.js.map