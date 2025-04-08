import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import styles from "../styles/ChatPage.module.css";

export default function ChatPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [theme, setTheme] = useState("blue");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const savedTheme = localStorage.getItem("theme") || "blue";

        if (!user) {
            router.push("/login");
        } else {
            setIsGuest(!!user.guest);
            setTheme(savedTheme);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className={`${styles.chatPage} ${styles[theme]}`}>
            <Sidebar isGuest={isGuest} />
            <ChatWindow isGuest={isGuest} />
        </div>
    );
}