import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function handleMessageList(ws: ExtendedWebSocket) {
  try {
    const userId = ws.userId;

    if (!ws.userId) {
      return ws.send(
        JSON.stringify({
          event: "error",
          message: "Unauthorize access",
        })
      );
    }

    const rooms = await prisma.room.findMany({
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
        if (room.type === "ONE_TO_ONE") {
          const otherUser =
            room.users.find((u) => u.user.id !== userId)?.user || null;
          return {
            roomId: room.id,
            type: room.type,
            name: otherUser?.fullName || "Unknown",
            image: otherUser?.image || "",
            membersCount: 2,
            lastMessage: room.chat[0] || null,
            onlineUsers: onlineUsers.has(otherUser?.id ?? ""),
          };
        }

        if (room.type === "GROUP") {
          return {
            roomId: room.id,
            type: room.type,
            name: room.name || "Unnamed Group",
            image: "",
            membersCount: room.users.length,
            lastMessage: room.chat[0] || null,
          };
        }

        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        const aDate = a.lastMessage?.createdAt
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;
        const bDate = b.lastMessage?.createdAt
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;
        return bDate - aDate;
      });

    ws.send(
      JSON.stringify({
        event: "messageList",
        data: userWithLastMessages,
      })
    );
  } catch (error) {
    console.error("Error fetching user list with last messages:", error);
    ws.send(
      JSON.stringify({
        event: "error",
        message: "Failed to fetch users with last messages",
      })
    );
  }
}
