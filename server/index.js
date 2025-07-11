const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const PORT = 5000;

//全員チャット
const chatNamespace = io.of("/chat");

//クライアントと通信
chatNamespace.on("connection", (socket) => {
  console.log("クライアントと接続しました！");

  //クライアントから受信
  socket.on("send_message", (data) => {
    console.log(data);

    //クライアントへ送信
    socket.emit("received_message", data);
  });

  socket.on("disconnect", () => {
    console.log("クライアントと接続が切れました！");
  });
});

//グループチャット
const groupNamespace = io.of("/group");

groupNamespace.on("connection", (socket) => {
  console.log("🟢 /group に接続:", socket.id);

  // ルーム参加
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} が ${roomId} に参加`);
  });

  // メッセージ送信（ルーム限定）
  socket.on("send_message", ({ roomId, message }) => {
    console.log(`Room[${roomId}] <- ${message}`);
    groupNamespace.to(roomId).emit("received_message", { message });
  });

  socket.on("disconnect", () => {
    console.log("🔴 /group 切断:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
