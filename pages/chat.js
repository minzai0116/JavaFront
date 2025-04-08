import dynamic from "next/dynamic";

const ChatPage = dynamic(() => import("../components/ChatPage"), {
    ssr: false, // ⛔ 서버사이드 렌더링 비활성화
});

export default ChatPage;