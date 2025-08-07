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
exports.messageToAdmin = messageToAdmin;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const authenticate_1 = require("./authenticate");
function messageToAdmin(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, images } = data;
        const admin = yield prisma_1.default.user.findFirst({
            where: { role: "ADMIN" },
            select: { id: true },
        });
        if (!admin) {
            return ws.send(JSON.stringify({ event: "error", message: "Admin not found" }));
        }
        const receiverId = admin.id;
        if (!ws.userId || !message) {
            return ws.send(JSON.stringify({ event: "error", message: "Invalid message payload" }));
        }
        let room = yield prisma_1.default.room.findFirst({
            where: {
                type: "ONE_TO_ONE",
                AND: [
                    { users: { some: { userId: ws.userId } } },
                    { users: { some: { userId: receiverId } } },
                ],
            },
            include: { users: true },
        });
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
                include: {
                    users: true,
                },
            });
        }
        const chat = yield prisma_1.default.chat.create({
            data: {
                senderId: ws.userId,
                receiverId,
                roomId: room.id,
                message,
                images: images || "",
            },
        });
        const receiverSocket = authenticate_1.userSockets.get(receiverId);
        if (receiverSocket) {
            receiverSocket.send(JSON.stringify({ event: "messageToAdmin", data: chat }));
        }
        ws.send(JSON.stringify({ event: "messageToAdmin", data: chat }));
    });
}
