import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const userSockets = new Map<string, ExtendedWebSocket>();

export async function messageToAdmin(ws: ExtendedWebSocket, data: any) {
  const { message, images } = data;

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (!admin) {
    return ws.send(
      JSON.stringify({ event: "error", message: "Admin not found" })
    );
  }

  const receiverId = admin.id;

  if (!ws.userId || !message) {
    return ws.send(
      JSON.stringify({ event: "error", message: "Invalid message payload" })
    );
  }

  let room = await prisma.room.findFirst({
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
      include: {
        users: true,
      },
    });
  }

  const chat = await prisma.chat.create({
    data: {
      senderId: ws.userId,
      receiverId,
      roomId: room.id,
      message,
      images: images || "",
    },
  });

  const receiverSocket = userSockets.get(receiverId);
  if (receiverSocket) {
    receiverSocket.send(
      JSON.stringify({ event: "messageToAdmin", data: chat })
    );
  }
  ws.send(JSON.stringify({ event: "messageToAdmin", data: chat }));
}
