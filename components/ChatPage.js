import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import styles from "../styles/ChatPage.module.css";

export default function ChatPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [theme, setTheme] = useState("blue");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const savedTheme = localStorage.getItem("theme") || "blue";
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
            setIsGuest(!!storedUser.guest);
            setTheme(savedTheme);
            setIsLoading(false);
            return;
        }

        if (status === "authenticated" && session?.user?.email) {
            const newUser = { email: session.user.email };
            localStorage.setItem("user", JSON.stringify(newUser));
            setIsGuest(false);
            setTheme(savedTheme);
            setIsLoading(false);
        }

        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, session, router]);

    if (isLoading || status === "loading") return <div>Loading...</div>;

    return (
        <div className={`${styles.chatPage} ${styles[theme]}`}>
            <Sidebar isGuest={isGuest} />
            <ChatWindow isGuest={isGuest} />
        </div>
    );
}