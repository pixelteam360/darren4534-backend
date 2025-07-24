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
exports.fetchAdminChats = fetchAdminChats;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
function fetchAdminChats(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield prisma_1.default.user.findFirst({
            where: { role: "ADMIN" },
            select: { id: true, fullName: true },
        });
        if (!admin) {
            return ws.send(JSON.stringify({ event: "error", message: "Admin not found" }));
        }
        let room = yield prisma_1.default.room.findFirst({
            where: {
                AND: [
                    { users: { some: { userId: ws.userId } } },
                    { users: { some: { userId: admin.id } } },
                ],
            },
            select: { id: true },
        });
        if (!room) {
            room = yield prisma_1.default.room.create({
                data: {
                    type: "ONE_TO_ONE",
                    name: `Admin-${admin.fullName}`,
                    users: {
                        create: [
                            { user: { connect: { id: ws.userId } } },
                            { user: { connect: { id: admin.id } } },
                        ],
                    },
                },
                select: { id: true },
            });
        }
        const chats = yield prisma_1.default.chat.findMany({
            where: { roomId: room === null || room === void 0 ? void 0 : room.id },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                message: true,
                images: true,
                createdAt: true,
                updatedAt: true,
                receiverId: true,
                senderId: true,
                isRead: true,
                receiver: { select: { image: true, fullName: true } },
                sender: { select: { image: true, fullName: true } },
            },
        });
        yield prisma_1.default.chat.updateMany({
            where: { roomId: room.id, isRead: false, receiverId: ws.userId },
            data: { isRead: true },
        });
        ws.send(JSON.stringify({
            event: "fetchChats",
            data: chats,
        }));
    });
}
