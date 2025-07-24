import { handleAuthenticate } from "./eventHandlers/authenticate";
import { fetchAdminChats } from "./eventHandlers/fetchAdminChats";
import { handleFetchChats } from "./eventHandlers/handleFetchChats";
import { handleMessage } from "./eventHandlers/handleMessage";
import { handleMessageList } from "./eventHandlers/handleMessageList";
import { messageToAdmin } from "./eventHandlers/messageToAdmin";
import { ExtendedWebSocket } from "./types";
import { WebSocketServer } from "ws";

export function handleConnection(ws: ExtendedWebSocket, wss: WebSocketServer) {
  ws.on("message", async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      const { event } = parsed;

      switch (event) {
        case "authenticate":
          await handleAuthenticate(ws, parsed, wss);
          break;
        case "message":
          await handleMessage(ws, parsed);
          break;
        case "messageToAdmin":
          await messageToAdmin(ws, parsed);
          break;
        case "fetchAdminChats":
          await fetchAdminChats(ws);
          break;
        case "fetchChats":
          await handleFetchChats(ws, parsed);
          break;
        case "messageList":
          await handleMessageList(ws);
          break;
        default:
          console.warn("Unknown event:", event);
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      // update shared state
    }
  });
}
