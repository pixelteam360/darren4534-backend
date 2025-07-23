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
exports.handleMessageList = handleMessageList;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const onlineUsers = new Set();
function handleMessageList(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = ws.userId;
            const rooms = yield prisma_1.default.room.findMany({
                where: {
                    users: { some: { userId } },
                },
                include: {
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    image: true,
                                },
                            },
                        },
                    },
                    chat: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            });
            const userWithLastMessages = rooms
                .map((room) => {
                var _a, _b;
                if (room.type === "ONE_TO_ONE") {
                    const otherUser = ((_a = room.users.find((u) => u.user.id !== userId)) === null || _a === void 0 ? void 0 : _a.user) || null;
                    return {
                        roomId: room.id,
                        type: room.type,
                        name: (otherUser === null || otherUser === void 0 ? void 0 : otherUser.fullName) || "Unknown",
                        image: (otherUser === null || otherUser === void 0 ? void 0 : otherUser.image) || "",
                        lastMessage: room.chat[0] || null,
                        onlineUsers: onlineUsers.has((_b = otherUser === null || otherUser === void 0 ? void 0 : otherUser.id) !== null && _b !== void 0 ? _b : ""),
                    };
                }
                if (room.type === "GROUP") {
                    return {
                        roomId: room.id,
                        type: room.type,
                        name: room.name || "Unnamed Group",
                        membersCount: room.users.length,
                        lastMessage: room.chat[0] || null,
                    };
                }
                return null;
            })
                .filter(Boolean)
                .sort((a, b) => {
                var _a, _b;
                const aDate = ((_a = a.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt)
                    ? new Date(a.lastMessage.createdAt).getTime()
                    : 0;
                const bDate = ((_b = b.lastMessage) === null || _b === void 0 ? void 0 : _b.createdAt)
                    ? new Date(b.lastMessage.createdAt).getTime()
                    : 0;
                return bDate - aDate;
            });
            ws.send(JSON.stringify({
                event: "messageList",
                data: userWithLastMessages,
            }));
        }
        catch (error) {
            console.error("Error fetching user list with last messages:", error);
            ws.send(JSON.stringify({
                event: "error",
                message: "Failed to fetch users with last messages",
            }));
        }
    });
}
