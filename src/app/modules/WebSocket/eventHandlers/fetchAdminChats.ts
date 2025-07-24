import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

export async function fetchAdminChats(ws: ExtendedWebSocket) {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true, fullName: true },
  });

  if (!admin) {
    return ws.send(
      JSON.stringify({ event: "error", message: "Admin not found" })
    );
  }

  let room = await prisma.room.findFirst({
    where: {
      AND: [
        { users: { some: { userId: ws.userId } } },
        { users: { some: { userId: admin.id } } },
      ],
    },
    select: { id: true },
  });

  if (!room) {
    room = await prisma.room.create({
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

  const chats = await prisma.chat.findMany({
    where: { roomId: room?.id },
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
    where: { roomId: room.id, isRead: false, receiverId: ws.userId },
    data: { isRead: true },
  });

  ws.send(
    JSON.stringify({
      event: "fetchChats",
      data: chats,
    })
  );
}
