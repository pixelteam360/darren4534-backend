import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const userSockets = new Map<string, ExtendedWebSocket>();

export async function handleMessage(ws: ExtendedWebSocket, data: any) {
  const { receiverId, roomId, message, images } = data;

  if (!ws.userId || !message) {
    return ws.send(
      JSON.stringify({ event: "error", message: "Invalid message payload" })
    );
  }

  let room;

  if (roomId) {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { users: { select: { userId: true } } },
    });

    if (!room) {
      return ws.send(
        JSON.stringify({ event: "error", message: "Room not found" })
      );
    }
  } else {
    const existingRooms = await prisma.room.findMany({
      where: {
        type: "ONE_TO_ONE",
        users: {
          some: { userId: ws.userId },
        },
      },
      include: { users: true },
    });

    room = existingRooms.find(
      (r) =>
        r.users.some((u) => u.userId === receiverId) && r.users.length === 2
    );

    if (!room) {
      room = await prisma.room.create({
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

  const chat = await prisma.chat.create({
    data: {
      senderId: ws.userId,
      receiverId: room.type === "ONE_TO_ONE" ? receiverId : null,
      roomId: room.id,
      message,
      images: images || "",
    },
  });

  for (const member of room.users) {
    if (member.userId === ws.userId) continue;

    const receiverSocket = userSockets.get(member.userId);
    if (receiverSocket) {
      receiverSocket.send(JSON.stringify({ event: "message", data: chat }));
    }
  }

  ws.send(JSON.stringify({ event: "message", data: chat }));
}
