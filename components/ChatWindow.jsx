import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/ChatWindow.module.css";

export default function ChatWindow({ isGuest, newChatTrigger, selectedSessionId, theme = "blue", onSessionCreated }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState("상담스타일을 선택해주세요");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const counselingStyles = ["다정한", "공감과 위로", "현실적인 조언"];
    const emotionButtons = ["슬퍼요 😢", "불안해요 😨", "조언이 필요해요 💡"];

    useEffect(() => {
        const newId = uuidv4();
        setSessionId(newId);
        setMessages([]);
        setShowIntro(true);

        const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
        const alreadyExists = storedSessions.some((s) => s.id === newId);
        if (!alreadyExists) {
            const newSession = {
                id: newId,
                title: "New Chat",
                createdAt: new Date(),
                messages: [],
            };
            localStorage.setItem("chatSessions", JSON.stringify([...storedSessions, newSession]));

            if (onSessionCreated) onSessionCreated();
        }
    }, [newChatTrigger]);

    useEffect(() => {
        if (!selectedSessionId) return;

        const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
        const session = storedSessions.find((s) => s.id === selectedSessionId);
        if (session) {
            setSessionId(session.id);
            setMessages(session.messages || []);
            setShowIntro((session.messages || []).length === 0);
        }
    }, [selectedSessionId]);

    const handleSend = async () => {
        if (!input.trim() || !sessionId) return;

        setIsSending(true);

        const userMessage = { id: Date.now(), sender: "user", text: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setShowIntro(false);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, style: selectedStyle }),
            });
            const data = await res.json();

            const botMessage = { id: Date.now() + 1, sender: "bot", text: data.message };
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);

            const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
            const sessionIndex = storedSessions.findIndex((s) => s.id === sessionId);
            if (sessionIndex !== -1) {
                storedSessions[sessionIndex].messages = finalMessages;
                localStorage.setItem("chatSessions", JSON.stringify(storedSessions));
            }
        } catch (error) {
            console.error("❌ 모델 응답 실패:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`${styles.chatContainer} ${styles[theme]}`}>
            {/* 상담 스타일 선택 */}
            <div className={styles.dropdownWrapper}>
                <button className={styles.dropdownToggle} onClick={() => setDropdownOpen((prev) => !prev)}>
                    <span>{selectedStyle}</span>
                </button>
                {dropdownOpen && (
                    <ul className={styles.dropdownList}>
                        {counselingStyles.map((style) => (
                            <li
                                key={style}
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setSelectedStyle(style);
                                    setDropdownOpen(false);
                                }}
                            >
                                {style}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 소개 메시지 */}
            {messages.length === 0 && showIntro && (
                <div className={styles.emptyMessageBox}>
                    <div className={styles.heartEmoji}>💖</div>
                    <h2 className={styles.emptyTitle}>Let me hear your heart</h2>
                    <p className={styles.emptyDescription}>
                        Start by sharing anything on your mind.<br />I'm here to listen and support you.
                    </p>
                    <div className={styles.emotionButtons}>
                        {emotionButtons.map((emotion, idx) => (
                            <button
                                key={idx}
                                className={styles.emotionBtn}
                                onClick={() => setShowIntro(false)}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 메시지 출력 영역 */}
            <div className={styles.messageList}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.messageBubble} ${msg.sender === "user" ? styles.userMessage : styles.botMessage}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* 입력창 */}
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
                            if (e.key === "Enter" && !e.nativeEvent.isComposing && !isSending) {
                                handleSend();
                            }
                        }}
                        type="text"
                        placeholder="Let me hear your heart"
                        className={styles.inputField}
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSend}
                        className={styles.sendButton}
                        disabled={isSending}
                    >
                        <img src="/send.svg" alt="Send" className={styles.sendIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
}

