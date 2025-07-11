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

    socket.on('disconnect', () => {
        console.log("クライアントと接続が切れました！");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});