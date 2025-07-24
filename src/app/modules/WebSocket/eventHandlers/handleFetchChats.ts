import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

export async function handleFetchChats(ws: ExtendedWebSocket, data: any) {
  const { roomId } = data;

  if (!ws.userId) {
    return ws.send(
      JSON.stringify({
        event: "error",
        message: "Unauthorize access",
      })
    );
  }

  if (!roomId) {
    return ws.send(
      JSON.stringify({
        event: "error",
        message: "Room Id not found",
      })
    );
  }

  const chats = await prisma.chat.findMany({
    where: { roomId: roomId },
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

  await prisma.chat.updateMany({
    where: { roomId: roomId },
    data: { isRead: true },
  });

  ws.send(
    JSON.stringify({
      event: "fetchChats",
      data: chats,
    })
  );
}
