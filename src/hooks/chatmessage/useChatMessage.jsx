import { useContext } from "react";
import { ChatMessageContext } from "./ChatMessageProvider";

export default function useChatMessage() {
    return useContext(ChatMessageContext);
}