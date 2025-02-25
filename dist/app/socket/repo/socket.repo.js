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
const database_1 = __importDefault(require("../../../config/database"));
const constant_1 = __importDefault(require("../../../config/constant"));
// Import Libraries
class SocketRepo {
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : save the user socket
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    saveSocketData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .insert(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : update socket id
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    updateSocketId(userUuid, updateSocketData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .update(updateSocketData)
                    .where('user_uuid', userUuid);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get socket id of sender and receiver uuid
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getSocketId(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const socket = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .select(['socket_id', 'user_uuid']);
                if (Array.isArray(userUuid)) {
                    socket.whereIn('user_uuid', userUuid);
                }
                else {
                    socket.where('user_uuid', userUuid);
                }
                return yield socket;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete user
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteSocketUser(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .where('user_uuid', uuid)
                    .del();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete socket details by socket id
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    deleteUserBySocketId(socket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .where('socket_id', socket_id)
                    .del();
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user by socket id
    🗓 @created : 16/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    getUserBySocketId(socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const socket = (0, database_1.default)(`${constant_1.default.schema.USERS}.${constant_1.default.tables.USER_SOCKET}`)
                    .select(['socket_id', 'user_uuid'])
                    .where('socket_id', socketId);
                return yield socket;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new SocketRepo();
//# sourceMappingURL=socket.repo.js.map