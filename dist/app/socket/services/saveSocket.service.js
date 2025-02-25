"use strict";
// Import Libraries
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
//  Import Repo
const socket_repo_1 = __importDefault(require("../repo/socket.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : socket service
🗓 @created : 16/08/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const socketService = (id, user_uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  save user data
        //
        yield saveSocketUser(id, user_uuid);
    }
    catch (error) {
        throw error;
    }
});
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : save socket id and user uuid
🗓 @created : 16/08/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveSocketUser = (id, user_uuid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        //  prepare data model to save socket data
        //
        const socketUserDataModel = {
            user_uuid: user_uuid,
            socket_id: id
        };
        //
        //  check if user already exists or not 
        //
        const [user] = yield socket_repo_1.default.getSocketId(user_uuid);
        if (user) {
            //
            //  update socket data model
            //
            const updateSocketData = {
                socket_id: id
            };
            yield socket_repo_1.default.updateSocketId(user_uuid, updateSocketData);
        }
        else {
            //
            //  save socket data
            //
            yield socket_repo_1.default.saveSocketData(socketUserDataModel);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.default = socketService;
//# sourceMappingURL=saveSocket.service.js.map