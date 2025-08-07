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
exports.handleMessage = handleMessage;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const authenticate_1 = require("./authenticate");
function handleMessage(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverId, roomId, message, images } = data;
        if (!ws.userId || !message) {
            return ws.send(JSON.stringify({ event: "error", message: "Invalid message payload" }));
        }
        let room;
        if (roomId) {
            room = yield prisma_1.default.room.findUnique({
                where: { id: roomId },
                include: { users: { select: { userId: true } } },
            });
            if (!room) {
                return ws.send(JSON.stringify({ event: "error", message: "Room not found" }));
            }
        }
        else {
            const existingRooms = yield prisma_1.default.room.findMany({
                where: {
                    type: "ONE_TO_ONE",
                    users: {
                        some: { userId: ws.userId },
                    },
                },
                include: { users: true },
            });
            room = existingRooms.find((r) => r.users.some((u) => u.userId === receiverId) && r.users.length === 2);
            if (!room) {
                room = yield prisma_1.default.room.create({
                    data: {
                        type: "ONE_TO_ONE",
                        users: {
                            create: [
                                { user: { connect: { id: ws.userId } } },
                                { user: { connect: { id: receiverId } } },
                            ],
                        },
                    },
                    include: { users: { select: { userId: true } } },
                });
            }
        }
        const chat = yield prisma_1.default.chat.create({
            data: {
                senderId: ws.userId,
                receiverId: room.type === "ONE_TO_ONE" ? receiverId : null,
                roomId: room.id,
                message,
                images: images || "",
            },
        });
        for (const member of room.users) {
            if (member.userId === ws.userId)
                continue;
            const receiverSocket = authenticate_1.userSockets.get(member.userId);
            if (receiverSocket) {
                receiverSocket.send(JSON.stringify({ event: "message", data: chat }));
            }
        }
        ws.send(JSON.stringify({ event: "message", data: chat }));
    });
}
