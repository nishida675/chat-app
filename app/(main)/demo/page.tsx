"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Home.module.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000/chat", {
  transports: ["websocket"],    
  withCredentials: true,         
});

type ChatMessage = {
  message: string;
};

const DemoPage = () => {
  const [messages, setMessages] = useState<string>("");
  const [list, setList] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // 一度だけイベントリスナー登録
    socket.on("received_message", (data: ChatMessage) => {
      console.log("受信:", data);

      // 最新のリストに追加（prevを使うことで正しい状態を参照）
      setList((prev) => [...prev, data]);
    });

    // コンポーネントのアンマウント時にイベント解除
    return () => {
      socket.off("received_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (messages.trim() === "") return;
    socket.emit("send_message", { message: messages });
    setMessages("");
  };

  return (
    <div className={styles.container}>
      <h2>チャットアプリ</h2>
      <div className={styles.chatInputButton}>
        <input
          type="text"
          placeholder="入力してね"
          onChange={(e) => setMessages(e.target.value)}
          value={messages}
        />
        <button onClick={handleSendMessage}>チャット送信</button>
      </div>
      {list.map((chat, index) => (
        <div className={styles.chatArea} key={index}>
          {chat.message}
        </div>
      ))}
    </div>
  );
};

export default DemoPage;
