import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import styles from "@/styles/ChatPage.module.css";

export default function ChatPage() {
    const [isClient, setIsClient] = useState(false);
    const sessionData = typeof window !== "undefined" ? useSession() : null;
    const session = sessionData?.data;
    const status = sessionData?.status;
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && status === "unauthenticated") {
            router.replace("/login");
        }
    }, [isClient, status, router]);

    if (!isClient || status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.chatPage}>
            <Sidebar />
            <ChatWindow />
        </div>
    );
}