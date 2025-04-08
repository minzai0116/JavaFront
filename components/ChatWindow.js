import { useState } from "react";
import styles from "../styles/ChatWindow.module.css";

export default function ChatWindow({ isGuest = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const emotions = ["😊", "😢", "😡"];
  const emotionLabels = ["행복해요", "슬퍼요", "화가나요"];

  const handleEmotionClick = (index) => {
    if (selectedEmotion === index) {
      setSelectedEmotion(null); // toggle off
    } else {
      setSelectedEmotion(index);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {messages.length === 0 && (
        <div className={styles.emptyMessageBox}>
          <h2>Let me hear your heart 💜</h2>
          <p>오늘 당신의 감정을 골라주세요</p>
          <div className={styles.emotionPicker}>
            {emotions.map((emo, i) => (
              <button
                key={i}
                className={styles.emotionButton}
                onClick={() => handleEmotionClick(i)}
              >
                <span>{emo}</span>
                <span>{emotionLabels[i]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.inputWrapper}>
        <div className={styles.inputBox}>
          <img
            src="/sound_of_mind.svg"
            alt="Sound of Mind"
            className={styles.inputIcon}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                handleSend();
              }
            }}
            type="text"
            placeholder="Let me hear your heart"
            className={styles.inputField}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            <img src="/send.svg" alt="Send" className={styles.sendIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}