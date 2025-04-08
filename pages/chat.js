import { useSession } from "next-auth/react";

export default function ChatPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div>Loading...</div>;
    if (!session) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    return (
        <div>
            {/* 채팅 인터페이스 */}
        </div>
    );
}