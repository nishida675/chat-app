"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Home.module.css";
import io from "socket.io-client";

// /group に接続
const socket = io("http://localhost:5000/group", {
  transports: ["websocket"],
  withCredentials: true,
});

type ChatMessage = {
  message: string;
};

const GroupPage = () => {
  const [roomId, setRoomId] = useState<string>(""); // 入力中のルームID
  const [joinedRoom, setJoinedRoom] = useState<string>(""); // 実際に参加済みのルームID
  const [messages, setMessages] = useState<string>(""); // 入力中のメッセージ
  const [list, setList] = useState<ChatMessage[]>([]); // 表示用チャット履歴

  // サーバーからメッセージ受信時
  useEffect(() => {
    socket.on("received_message", (data: ChatMessage) => {
      console.log("受信:", data);
      setList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("received_message");
    };
  }, []);

  // ルームに参加
  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    socket.emit("join_room", roomId);
    setJoinedRoom(roomId);
  };

  // メッセージ送信
  const handleSendMessage = () => {
    if (!messages.trim() || !joinedRoom) return;
    socket.emit("send_message", { roomId: joinedRoom, message: messages });
    setMessages("");
  };

  // ===== 表示切替 =====
  if (!joinedRoom) {
    return (
      <div className={styles.container}>
        <h2>ルームに参加</h2>
        <div className={styles.chatInputButton}>
          <input
            type="text"
            placeholder="ルームIDを入力"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoinRoom}>参加</button>
        </div>
      </div>
    );
  }

  // ===== チャット画面 =====
  return (
    <div className={styles.container}>
      <h2>ルーム: {joinedRoom}</h2>

      <div className={styles.chatInputButton}>
        <input
          type="text"
          placeholder="メッセージを入力"
          onChange={(e) => setMessages(e.target.value)}
          value={messages}
        />
        <button onClick={handleSendMessage}>送信</button>
      </div>
      {list.map((chat, index) => (
        <div className={styles.chatArea} key={index}>
          {chat.message}
        </div>
      ))}
    </div>
  );
};

export default GroupPage;
