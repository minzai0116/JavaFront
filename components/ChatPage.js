import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import styles from "@/styles/ChatPage.module.css";

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [theme, setTheme] = useState("blue");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || status === "loading") return;

        const storedUser = JSON.parse(localStorage.getItem("user"));
        const savedTheme = localStorage.getItem("theme") || "blue";

        if (storedUser) {
            setIsGuest(!!storedUser.guest);
            setTheme(savedTheme);
        } else if (status === "authenticated" && session?.user?.email) {
            localStorage.setItem("user", JSON.stringify({ email: session.user.email }));
            setIsGuest(false);
            setTheme(savedTheme);
        } else {
            router.replace("/login");
        }
    }, [isClient, session, status, router]);

    if (!isClient || status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className={`${styles.chatPage} ${styles[theme + "Theme"]}`}>
            <Sidebar isGuest={isGuest} />
            <ChatWindow isGuest={isGuest} />
        </div>
    );
}