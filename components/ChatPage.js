import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import styles from "@/styles/ChatPage.module.css";

export default function ChatPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

    if (!isClient || status === "loading") return <div>Loading...</div>;

    return (
        <div className={styles.chatPage}>
            <Sidebar />
            <ChatWindow />
        </div>
    );
}