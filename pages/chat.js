import dynamic from "next/dynamic";
const ChatPage = dynamic(() => import("../components/ChatPage"), { ssr: false });
export default ChatPage;