import "./styles.css";
import { ForumMessage as ForumMessageType } from "@/app/types";

type Props = {
    message: ForumMessageType;
};

const ForumMessage = ({ message }: Props) => {
    const date = new Date(message.createdAt).toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="message">
            <div className="messageHeader">
                <span className="messageUsername">{message.username || "Usuario"}</span>
                <span className="messageDate">{date}</span>
            </div>
            <p className="messageText">{message.text}</p>
        </div>
    );
};

export default ForumMessage;
