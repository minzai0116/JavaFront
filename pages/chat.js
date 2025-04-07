import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import styles from "../styles/ChatPage.module.css";

export default function ChatPage() {
    const { data: session, status } = useSession(); // ✅ 세션 사용
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // ✅ 로그인 안됐으면 이동
        }
    }, [status]);

    if (status === "loading") return <div>Loading...</div>;

    return (
        <div className={styles.chatPage}>
            <Sidebar />
            <ChatWindow />
        </div>
    );
}